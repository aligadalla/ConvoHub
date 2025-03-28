import { Router } from "express";
import authController from "../auth/auth.controller.js";
import channelController from "./channel.controller.js";

const channelRouter = Router();

channelRouter.post(
  "/create",
  authController.authorize,
  channelController.createChannel
);

channelRouter.get(
  "/:channelId",
  authController.authorize,
  channelController.getChannel
);

channelRouter.delete(
  "/:channelId",
  authController.authorize,
  channelController.deleteChannel
);

channelRouter.patch(
  "/join/:channelId",
  authController.authorize,
  channelController.joinChannel
);

channelRouter.patch(
  "/leave/:channelId",
  authController.authorize,
  channelController.leaveChannel
);

export default channelRouter;
