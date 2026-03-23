import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { canTransitionOrder, ORDER_STATUSES } from "../utils/orderWorkflow.js";

const buildShippingAddress = (payload = {}) => ({
  fullName: payload.fullName,
  phone: payload.phone,
  addressLine1: payload.addressLine1,
  addressLine2: payload.addressLine2,
  district: payload.district,
  state: payload.state,
  postalCode: payload.postalCode
});

const recalculateOrderTotals = (order) => {
  order.subtotal = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  order.totalAmount = order.subtotal + (order.deliveryCharge || 0);
};

export const createOrder = asyncHandler(async (req, res) => {
  const { items = [], shippingAddress, deliveryCharge = 0, notes } = req.body;

  if (!items.length) {
    throw new ApiError(400, "Order must include at least one item");
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } }).populate("farmer", "_id role name");

  if (products.length !== items.length) {
    throw new ApiError(404, "One or more products were not found");
  }

  const farmerIds = [...new Set(products.map((product) => String(product.farmer._id)))];

  if (farmerIds.length !== 1) {
    throw new ApiError(400, "All items in one order must belong to the same farmer");
  }

  const farmerId = farmerIds[0];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let existingOrder = await Order.findOne({
      buyer: req.user._id,
      farmer: farmerId,
      status: "Pending"
    }).session(session);

    const hadExistingOrder = Boolean(existingOrder);

    if (!existingOrder) {
      existingOrder = new Order({
        buyer: req.user._id,
        farmer: farmerId,
        items: [],
        status: "Pending",
        paymentStatus: "Pending",
        subtotal: 0,
        deliveryCharge: Number(deliveryCharge) || 0,
        totalAmount: 0,
        shippingAddress: buildShippingAddress(shippingAddress),
        notes
      });
    }

    for (const requestedItem of items) {
      const product = products.find((entry) => String(entry._id) === String(requestedItem.productId));

      if (!product) {
        throw new ApiError(404, "Product not found during order validation");
      }

      if (requestedItem.quantity <= 0) {
        throw new ApiError(400, "Quantity must be at least 1");
      }

      const existingItem = existingOrder.items.find(
        (item) => String(item.product) === String(product._id)
      );

      const nextQuantity = (existingItem?.quantity || 0) + requestedItem.quantity;
      const remainingStock = product.stock - (existingItem?.quantity || 0);

      if (nextQuantity > product.stock) {
        if (remainingStock <= 0) {
          throw new ApiError(400, `No more ${product.name} left right now.`);
        }

        throw new ApiError(
          400,
          `Only ${remainingStock}${product.unit || " units"} of ${product.name} left right now.`
        );
      }

      if (existingItem) {
        existingItem.quantity = nextQuantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
        existingOrder.items.push({
          product: product._id,
          productName: product.name,
          quantity: requestedItem.quantity,
          unitPrice: product.price,
          totalPrice: product.price * requestedItem.quantity
        });
      }
    }

    if (!existingOrder.shippingAddress?.district && shippingAddress) {
      existingOrder.shippingAddress = buildShippingAddress(shippingAddress);
    }

    if (typeof notes === "string" && notes.trim()) {
      existingOrder.notes = notes;
    }

    existingOrder.deliveryCharge = Number(deliveryCharge) || 0;
    recalculateOrderTotals(existingOrder);
    await existingOrder.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: hadExistingOrder ? "Order quantity updated successfully" : "Order placed successfully",
      data: existingOrder
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const getMyBuyerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate("farmer", "name location")
    .populate("items.product", "name cropType unit stock")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
});

export const getFarmerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ farmer: req.user._id })
    .populate("buyer", "name email location")
    .populate("items.product", "name cropType unit stock")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate("buyer", "name email")
    .populate("farmer", "name email")
    .populate("items.product", "name cropType unit stock");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const canAccess =
    String(order.buyer._id) === String(req.user._id) ||
    String(order.farmer._id) === String(req.user._id) ||
    req.user.role === "Admin";

  if (!canAccess) {
    throw new ApiError(403, "You cannot access this order");
  }

  res.json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!ORDER_STATUSES.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findById(req.params.orderId).session(session);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    const isFarmerOwner = String(order.farmer) === String(req.user._id);
    const isAdmin = req.user.role === "Admin";

    if (!isFarmerOwner && !isAdmin) {
      throw new ApiError(403, "Only the assigned farmer or admin can update this order");
    }

    if (!isAdmin && !canTransitionOrder(order.status, status)) {
      throw new ApiError(400, `Invalid status transition from ${order.status} to ${status}`);
    }

    if (status === "Accepted") {
      for (const item of order.items) {
        const product = await Product.findById(item.product).session(session);

        if (!product) {
          throw new ApiError(404, `Product missing for ${item.productName}`);
        }

        if (product.stock < item.quantity) {
          throw new ApiError(400, `Cannot accept order. Only ${product.stock}${product.unit || " units"} of ${product.name} available, but buyer requested ${item.quantity}.`);
        }
      }

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }, { session });
      }

      order.paymentStatus = "Paid";
    }

    if (status === "Rejected") {
      order.paymentStatus = "Failed";
    }

    order.status = status;
    await order.save({ session });
    await session.commitTransaction();

    res.json({
      success: true,
      message: status === "Rejected" ? "Order rejected successfully" : "Order status updated successfully",
      data: order
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const getFarmerOrderAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Order.aggregate([
    { $match: { farmer: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$totalAmount", 0] }
        },
        pendingOrders: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
        shippedOrders: { $sum: { $cond: [{ $eq: ["$status", "Shipped"] }, 1, 0] } },
        deliveredOrders: { $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] } },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: analytics[0] || {
      totalRevenue: 0,
      pendingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      totalOrders: 0
    }
  });
});
