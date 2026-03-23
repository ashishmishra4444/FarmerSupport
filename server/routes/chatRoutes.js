import { Router } from "express";
import { createOrGetChat, getMyChats, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getMyChats);
router.post("/", createOrGetChat);
router.post("/:chatId/messages", sendMessage);

export default router;
