import crypto from "crypto";
import Razorpay from "razorpay";
import { ApiError } from "../utils/apiError.js";

const currency = process.env.CURRENCY || "INR";

export const assertPaymentConfig = () => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new ApiError(500, "RAZORPAY_KEY_ID is missing");
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "RAZORPAY_KEY_SECRET is missing");
  }
};

export const getRazorpayClient = () => {
  assertPaymentConfig();

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

export const generateInvoiceNumber = (orderId) => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `INV-${date}-${String(orderId).slice(-6).toUpperCase()}`;
};

export const createRazorpayOrder = async (order, receipt) => {
  const client = getRazorpayClient();

  return client.orders.create({
    amount: Math.round(order.totalAmount * 100),
    currency,
    receipt,
    notes: {
      orderId: String(order._id),
      buyerId: String(order.buyer?._id || order.buyer),
      farmerId: String(order.farmer?._id || order.farmer)
    }
  });
};

export const buildCheckoutPayload = (order, razorpayOrder) => ({
  key: process.env.RAZORPAY_KEY_ID,
  amount: razorpayOrder.amount,
  currency: razorpayOrder.currency,
  orderId: razorpayOrder.id,
  internalOrderId: String(order._id),
  name: "Farmer Support",
  description: `Payment for order #${String(order._id).slice(-6).toUpperCase()}`
});

export const verifyCheckoutSignature = ({ orderId, paymentId, signature }) => {
  assertPaymentConfig();

  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSignature.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
};

export const verifyPaymentWebhookSignature = (rawBody, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    throw new ApiError(500, "RAZORPAY_WEBHOOK_SECRET is missing");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (!signature || expectedSignature.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
};

export const parsePaymentWebhook = (rawBody) => {
  const parsed = JSON.parse(rawBody.toString("utf8"));
  const entity = parsed?.payload?.payment?.entity || {};

  return {
    event: parsed.event,
    paymentId: entity.id,
    providerOrderId: entity.order_id,
    orderId: entity?.notes?.orderId,
    status: entity.status
  };
};

export const buildInvoiceData = (order, payment) => ({
  invoiceNumber: payment.invoiceNumber,
  invoiceIssuedAt: payment.invoiceIssuedAt,
  paidAt: payment.paidAt,
  provider: payment.provider,
  providerOrderId: payment.providerOrderId,
  providerPaymentId: payment.providerPaymentId,
  receipt: payment.receipt,
  currency: payment.currency,
  amount: payment.amount,
  order: {
    id: order._id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
    items: order.items,
    shippingAddress: order.shippingAddress,
    buyer: order.buyer,
    farmer: order.farmer
  }
});

