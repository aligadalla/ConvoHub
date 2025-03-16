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
  "delete/:id",
  authController.authorize,
  directMessageController.deleteMessage
);

directMessageRouter.get(
  "getChat/:id",
  authController.authorize,
  directMessageController.getChat
);
