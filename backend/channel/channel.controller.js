import AsyncWrapper from "../utils/AsyncWraper.js";
import channelService from "./channel.service.js";

class ChannelController {
  createChannel = AsyncWrapper(async (req, res) => {
    const data = await channelService.createChannel(
      req.user,
      req.body.name,
      req.body.private
    );
    res.status(201).json({ data: data });
  });

  getChannel = AsyncWrapper(async (req, res) => {
    const data = await channelService.getChannel(req.params.channelId);
    res.status(200).json({ data: data });
  });

  deleteChannel = AsyncWrapper(async (req, res) => {
    const data = await channelService.deleteChannel(
      req.user,
      req.params.channelId
    );
    res.status(200).json({ data: data });
  });

  joinChannel = AsyncWrapper(async (req, res) => {
    const data = await channelService.joinChannel(
      req.user,
      req.params.channelId
    );
    res.status(201).json({ data: data });
  });

  leaveChannel = AsyncWrapper(async (req, res) => {
    const data = await channelService.leaveChannel(
      req.user,
      req.params.channelId
    );
    res.status(200).json({ data: data });
  });
}

export default new ChannelController();
