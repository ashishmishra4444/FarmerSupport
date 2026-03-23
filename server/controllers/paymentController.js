import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Order } from "../models/Order.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.json({
    success: true,
    data: {
      razorpayOrderId: `mock_order_${order._id}`,
      amount: order.totalAmount * 100,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder"
    }
  });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentStatus = "Paid";
  order.paymentReference = req.body.paymentId || `mock_payment_${order._id}`;
  await order.save();

  res.json({
    success: true,
    message: "Payment marked as paid",
    data: order
  });
});
