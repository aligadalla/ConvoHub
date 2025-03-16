import { Router } from "express";
import authController from "../auth/auth.controller.js";
import messageController from "./message.controller.js";

const messageRouter = Router();

messageRouter.post(
  "/send/:channelId",
  authController.authorize,
  messageController.sendMessage
);

messageRouter.delete(
  "/delete/:id",
  authController.authorize,
  messageController.deleteMessage
);

messageRouter.get(
  "/getChannelMessages/:channelId",
  authController.authorize,
  messageController.getChannelMessages
);

messageRouter.patch(
  "addReaction/:messageId",
  authController.authorize,
  messageController.addReaction
);

messageRouter.patch(
  "removeReaction/:messageId",
  authController.authorize,
  messageController.removeReaction
);

export default messageRouter;
