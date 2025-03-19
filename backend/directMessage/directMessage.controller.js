import AsyncWrapper from "../utils/AsyncWraper.js";
import directMessageService from "./directMessage.service.js";

class DirectMessageController {
  sendMessage = AsyncWrapper(async (req, res) => {
    const data = await directMessageService.sendMessage(
      req.user,
      req.params.id,
      req.file,
      req.body.message
    );
    res.status(201).json({ data: data });
  });

  deleteMessage = AsyncWrapper(async (req, res) => {
    const message = await directMessageService.deleteMessage(
      req.user,
      req.params.messageId
    );
    res.status(200).json({ message: message });
  });

  getChat = AsyncWrapper(async (req, res) => {
    const data = await directMessageService.getChat(req.user, req.params.id);
    res.status(200).json({ data: data });
  });

  addReaction = AsyncWrapper(async (req, res) => {
    const data = await directMessageService.addReaction(
      req.user,
      req.params.messageId,
      req.body.type
    );
    res.status(200).json({ data: data });
  });

  removeReaction = AsyncWrapper(async (req, res) => {
    const data = await directMessageService.removeReation(
      req.user,
      req.params.messageId
    );
    res.status(200).json({ data: data });
  });
}

export default new DirectMessageController();
