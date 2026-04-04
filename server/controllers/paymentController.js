import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";
import {
  buildCheckoutPayload,
  buildInvoiceData,
  createRazorpayOrder as createProviderOrder,
  generateInvoiceNumber,
  parsePaymentWebhook,
  verifyCheckoutSignature,
  verifyPaymentWebhookSignature
} from "../services/paymentService.js";

const getAccessibleOrder = async (orderId, user) => {
  const order = await Order.findById(orderId)
    .populate("buyer", "name email")
    .populate("farmer", "name email location");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const canAccess = String(order.buyer?._id || order.buyer) === String(user._id) || user.role === "Admin";

  if (!canAccess) {
    throw new ApiError(403, "You cannot access this order payment");
  }

  return order;
};

const finalizeSuccessfulPayment = async ({ order, payment, paymentId, providerOrderId, signature }) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const sessionOrder = await Order.findById(order._id).session(session);
    const sessionPayment = await Payment.findById(payment._id).session(session);

    if (!sessionOrder || !sessionPayment) {
      throw new ApiError(404, "Payment record not found");
    }

    sessionPayment.status = "paid";
    sessionPayment.providerOrderId = providerOrderId || sessionPayment.providerOrderId;
    sessionPayment.providerPaymentId = paymentId || sessionPayment.providerPaymentId;
    sessionPayment.providerSignature = signature || sessionPayment.providerSignature;
    sessionPayment.paidAt = sessionPayment.paidAt || new Date();
    sessionPayment.invoiceNumber = sessionPayment.invoiceNumber || generateInvoiceNumber(sessionOrder._id);
    sessionPayment.invoiceIssuedAt = sessionPayment.invoiceIssuedAt || new Date();
    await sessionPayment.save({ session });

    sessionOrder.paymentStatus = "Paid";
    sessionOrder.paymentReference = sessionPayment.providerPaymentId;
    sessionOrder.paymentProvider = "Razorpay";
    await sessionOrder.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  const freshOrder = await Order.findById(order._id)
    .populate("buyer", "name email")
    .populate("farmer", "name email location");
  const freshPayment = await Payment.findById(payment._id);

  return buildInvoiceData(freshOrder, freshPayment);
};

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await getAccessibleOrder(req.params.orderId, req.user);

  if (order.status !== "Accepted") {
    throw new ApiError(400, "Payment is available only after the farmer accepts the order.");
  }

  if (order.paymentStatus !== "AwaitingPayment") {
    throw new ApiError(400, order.paymentStatus === "Paid" ? "This order is already paid" : "This order is not ready for payment.");
  }

  const receipt = `receipt_${String(order._id).slice(-8)}_${Date.now()}`;
  const razorpayOrder = await createProviderOrder(order, receipt);

  const payment = await Payment.create({
    order: order._id,
    buyer: order.buyer._id,
    amount: order.totalAmount,
    currency: razorpayOrder.currency,
    status: "created",
    provider: "Razorpay",
    receipt,
    providerOrderId: razorpayOrder.id
  });

  res.json({
    success: true,
    message: "Razorpay order created successfully",
    data: {
      ...buildCheckoutPayload(order, razorpayOrder),
      paymentRecordId: payment._id,
      buyer: {
        name: order.buyer?.name || "Buyer",
        email: order.buyer?.email || "",
        contact: order.shippingAddress?.phone || "9123456789"
      }
    }
  });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const order = await getAccessibleOrder(req.params.orderId, req.user);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (order.status !== "Accepted" || order.paymentStatus !== "AwaitingPayment") {
    throw new ApiError(400, "This order is not currently awaiting payment.");
  }

  const isValidSignature = verifyCheckoutSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature
  });

  if (!isValidSignature) {
    throw new ApiError(400, "Invalid Razorpay signature");
  }

  const payment = await Payment.findOne({
    order: order._id,
    providerOrderId: razorpay_order_id
  }).sort({ createdAt: -1 });

  if (!payment) {
    throw new ApiError(404, "Payment attempt not found");
  }

  const invoice = await finalizeSuccessfulPayment({
    order,
    payment,
    paymentId: razorpay_payment_id,
    providerOrderId: razorpay_order_id,
    signature: razorpay_signature
  });

  res.json({
    success: true,
    message: "Payment verified successfully",
    data: invoice
  });
});

export const getPaymentInvoice = asyncHandler(async (req, res) => {
  const order = await getAccessibleOrder(req.params.orderId, req.user);
  const payment = await Payment.findOne({ order: order._id, status: "paid" }).sort({ paidAt: -1, createdAt: -1 });

  if (!payment) {
    throw new ApiError(404, "Invoice not available until the payment is successful");
  }

  res.json({
    success: true,
    data: buildInvoiceData(order, payment)
  });
});

export const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}));
  const signature = String(req.headers["x-razorpay-signature"] || "");
  const isValid = verifyPaymentWebhookSignature(rawBody, signature);

  if (!isValid) {
    throw new ApiError(401, "Invalid webhook signature");
  }

  const event = parsePaymentWebhook(rawBody);

  if (event.event !== "payment.captured" || !event.orderId) {
    return res.json({ success: true, message: "Webhook received" });
  }

  const order = await Order.findById(event.orderId)
    .populate("buyer", "name email")
    .populate("farmer", "name email location");

  if (!order) {
    throw new ApiError(404, "Order not found for webhook event");
  }

  const payment = await Payment.findOne({
    order: order._id,
    providerOrderId: event.providerOrderId
  }).sort({ createdAt: -1 });

  if (!payment) {
    return res.json({ success: true, message: "Payment record not found for webhook" });
  }

  if (payment.status !== "paid" && order.status === "Accepted" && order.paymentStatus === "AwaitingPayment") {
    await finalizeSuccessfulPayment({
      order,
      payment,
      paymentId: event.paymentId,
      providerOrderId: event.providerOrderId,
      signature: ""
    });
  }

  res.json({ success: true, message: "Webhook processed successfully" });
});
