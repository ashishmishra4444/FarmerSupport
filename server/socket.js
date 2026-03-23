import { Server } from "socket.io";
import { Chat } from "./models/Chat.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("chat:join", (chatId) => {
      socket.join(chatId);
    });

    socket.on("chat:message", async ({ chatId, sender, text }) => {
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      chat.messages.push({
        sender,
        text
      });

      await chat.save();
      io.to(chatId).emit("chat:message", chat.messages.at(-1));
    });
  });

  return io;
};
