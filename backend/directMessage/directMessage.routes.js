import { Router } from "express";
import authController from "../auth/auth.controller.js";
import directMessageController from "./directMessage.controller.js";

const directMessageRouter = Router();

directMessageRouter.post(
  "/send/:id",
  authController.authorize,
  directMessageController.sendMessage
);

directMessageRouter.delete(
  "/delete/:messageId",
  authController.authorize,
  directMessageController.deleteMessage
);

directMessageRouter.get(
  "/getChat/:id",
  authController.authorize,
  directMessageController.getChat
);

directMessageRouter.patch("/addReaction/:messageId", authController.authorize);

directMessageRouter.patch(
  "/removeReaction/:messageId",
  authController.authorize
);

export default directMessageRouter;
