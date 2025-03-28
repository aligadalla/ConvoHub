import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import Channel from "./channel.model.js";

class ChannelService {
  async createChannel(user, name, private) {
    const exist = await Channel.findOne({ name: name });
    if (exist) throw new AppError("Channel name must be unique", 400);

    user._id = new mongoose.Types.ObjectId(user._id);
    const channelObj = {
      name: name,
      createdBy: user._id,
      members: [],
      private: private === "true",
      pendingRequests: [],
    };

    const channel = await Channel.create(channelObj);
    return channel;
  }

  async getChannel(channelId) {
    channelId = new mongoose.Types.ObjectId(channelId);
    const channel = await Channel.findById(channelId);
    if (!channel) throw new AppError("Channel not found", 400);
    return channel;
  }

  async deleteChannel(user, channelId) {
    channelId = new mongoose.Types.ObjectId(channelId);
    const channel = await Channel.findById(channelId);
    if (user._id.toString() !== channel.createdBy.toString())
      throw new AppError("Not authorized to delete channel", 401);

    await Channel.findByIdAndDelete(channelId);
    return "Channel deleted";
  }

  async joinChannel(user, channelId) {
    channelId = new mongoose.Types.ObjectId(channelId);
    const channel = await Channel.findById(channelId);

    if (!channel) throw new Error("Channel not found");

    if (channel.private) {
      if (channel.pendingRequests.includes(user._id))
        throw new Error("Join request already sent");

      return await Channel.findByIdAndUpdate(
        channelId,
        { $addToSet: { pendingRequests: user._id } },
        { new: true }
      );
    } else {
      if (channel.members.includes(user._id))
        throw new Error("User is already a member of this channel");

      return await Channel.findByIdAndUpdate(
        channelId,
        { $addToSet: { members: user._id } },
        { new: true }
      );
    }
  }

  async leaveChannel(user, channelId) {
    channelId = new mongoose.Types.ObjectId(channelId);
    const channel = await Channel.findById(channelId);

    if (!channel) throw new Error("Channel not found");

    if (!channel.members.includes(user._id))
      throw new Error("User is not a member of this channel");

    if (channel.createdBy.toString() === user._id.toString())
      throw new Error("Channel creator cannot leave.");

    return await Channel.findByIdAndUpdate(
      channelId,
      { $pull: { members: user._id } },
      { new: true }
    );
  }
}

export default new ChannelService();
