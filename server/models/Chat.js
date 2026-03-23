import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    sentAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const chatSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    messages: { type: [messageSchema], default: [] }
  },
  {
    timestamps: true
  }
);

export const Chat = mongoose.model("Chat", chatSchema);
