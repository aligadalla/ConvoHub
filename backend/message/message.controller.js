import AsyncWrapper from "../utils/AsyncWraper.js";
import messageService from "./message.service.js";

class MessagesController {
  sendMessage = AsyncWrapper(async (req, res) => {
    const data = await messageService.sendMessage(
      req.user,
      req.params.channelId,
      req.file,
      req.body
    );
    res.status(201).json({ data: data });
  });

  deleteMessage = AsyncWrapper(async (req, res) => {
    const data = await messageService.deleteMessage(
      req.user,
      req.params.messageId
    );
    res.status(200).json({ data: data });
  });

  getChannelMessages = AsyncWrapper(async (req, res) => {
    const data = await messageService.getChannelMessages(req.params.channelId);
    res.status(200).json({ data: data });
  });

  addReaction = AsyncWrapper(async (req, res) => {
    const data = await messageService.addReaction(
      req.user,
      req.params.messageId,
      req.body.type
    );
    res.status(201).json({ data: data });
  });

  removeReaction = AsyncWrapper(async (req, res) => {
    const data = await messageService.removeReation(
      req.user,
      req.params.messageId
    );
    res.status(201).json({ data: data });
  });
}

export default new MessagesController();
