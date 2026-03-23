import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
  const farmerLocation = {
    district: req.user.location?.district || "",
    state: req.user.location?.state || ""
  };

  const product = await Product.create({
    ...req.body,
    farmer: req.user._id,
    location: farmerLocation
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
});

export const getMarketplaceProducts = asyncHandler(async (req, res) => {
  const { cropType, minPrice, maxPrice, district, state, search } = req.query;
  const filter = {};

  if (cropType) {
    filter.cropType = new RegExp(cropType, "i");
  }

  if (search) {
    filter.$or = [{ name: new RegExp(search, "i") }, { cropType: new RegExp(search, "i") }];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (district) {
    filter["location.district"] = new RegExp(district, "i");
  }

  if (state) {
    filter["location.state"] = new RegExp(state, "i");
  }

  const products = await Product.find(filter)
    .populate("farmer", "name location")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: products
  });
});

export const getFarmerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ farmer: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: products
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (String(product.farmer) !== String(req.user._id) && req.user.role !== "Admin") {
    throw new ApiError(403, "You cannot update this product");
  }

  if (req.body.location) {
    delete req.body.location;
  }

  Object.assign(product, req.body);
  await product.save();

  res.json({
    success: true,
    message: "Product updated successfully",
    data: product
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (String(product.farmer) !== String(req.user._id) && req.user.role !== "Admin") {
    throw new ApiError(403, "You cannot delete this product");
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: "Product deleted successfully"
  });
});

export const getFarmerDashboardSummary = asyncHandler(async (req, res) => {
  const [productCount, lowStockCount, pendingOrders, deliveredRevenue] = await Promise.all([
    Product.countDocuments({ farmer: req.user._id }),
    Product.countDocuments({ farmer: req.user._id, stock: { $lte: 10 } }),
    Order.countDocuments({ farmer: req.user._id, status: "Pending" }),
    Order.aggregate([
      { $match: { farmer: req.user._id, paymentStatus: "Paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ])
  ]);

  res.json({
    success: true,
    data: {
      productCount,
      lowStockCount,
      pendingOrders,
      totalRevenue: deliveredRevenue[0]?.totalRevenue || 0
    }
  });
});
