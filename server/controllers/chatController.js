import { Chat } from "../models/Chat.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const getMyChats = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "Buyer"
      ? { buyer: req.user._id }
      : req.user.role === "Farmer"
        ? { farmer: req.user._id }
        : {};

  const chats = await Chat.find(query)
    .populate("buyer", "name")
    .populate("farmer", "name")
    .populate("product", "name")
    .sort({ updatedAt: -1 });

  res.json({
    success: true,
    data: chats
  });
});

export const createOrGetChat = asyncHandler(async (req, res) => {
  const { buyer, farmer, product } = req.body;

  let chat = await Chat.findOne({ buyer, farmer, product });

  if (!chat) {
    chat = await Chat.create({ buyer, farmer, product, messages: [] });
  }

  res.status(201).json({
    success: true,
    data: chat
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  chat.messages.push({
    sender: req.user._id,
    text: req.body.text
  });

  await chat.save();

  res.json({
    success: true,
    data: chat
  });
});
