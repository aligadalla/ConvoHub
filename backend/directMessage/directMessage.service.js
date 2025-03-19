import { z } from "zod";
import validateInput from "../utils/validateInput.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import DirectMessage from "./directMessage.model.js";
import User from "../user/user.model.js";

class DirectMessageService {
  async sendMessage(user, id, file, data) {
    id = new mongoose.Types.ObjectId(id);
    const isBlocked = await User.findOne({ id: user._id, blockedUsers: id });
    const blockedMe = await User.findOne({ id: id, blockedUsers: user._id });
    if (isBlocked || blockedMe)
      throw new AppError(
        "User is blocked or blocked you, can't send message",
        400
      );

    const message = {
      senderId: user._id.toString(),
      receiverId: id.toString(),
      content: data,
      mediaType: null,
      mediaUrl: null,
    };

    const messageSchema = z.object({
      senderId: z.string(),
      receiverId: z.string(),
      content: z.string(),
      mediaType: z.string().optional().nullable(),
      mediaUrl: z.string().optional().nullable(),
    });

    const validatedMessage = validateInput(messageSchema, message);

    validatedMessage.senderId = new mongoose.Types.ObjectId(user._id);
    validatedMessage.receiverId = new mongoose.Types.ObjectId(id);

    const newMessage = await DirectMessage.create(validatedMessage);
    return newMessage;
  }

  async deleteMessage(user, messageId) {
    messageId = new mongoose.Types.ObjectId(messageId);
    const message = await DirectMessage.findById(messageId);
    if (message.senderId.toString() !== user._id.toString())
      throw new AppError("Not authorized", 401);

    await DirectMessage.findByIdAndDelete(messageId);
    return "Successfully Deleted!!";
  }

  async getChat(user, id) {
    id = new mongoose.Types.ObjectId(id);
    const isBlocked = await User.findOne({ id: user._id, blockedUsers: id });
    const blockedMe = await User.findOne({ id: id, blockedUsers: user._id });
    if (isBlocked || blockedMe)
      throw new AppError(
        "User is blocked or blocked you, can't load conversation",
        400
      );

    const messages = await DirectMessage.find({
      $or: [
        { senderId: user._id, receiverId: id },
        { senderId: id, receiverId: user._id },
      ],
    }).sort({ createdAt: 1 });

    return messages;
  }

  async addReaction(user, messageId, type) {
    messageId = new mongoose.Types.ObjectId(messageId);
    const updatedMessage = DirectMessage.findByIdAndUpdate(
      messageId,
      {
        $push: {
          reactions: {
            userId: user._id,
            type: type,
          },
        },
      },
      { new: true }
    );

    if (!updatedMessage) throw new AppError("Message not found", 404);

    return updatedMessage;
  }

  async removeReation(user, messageId) {
    messageId = new mongoose.Types.ObjectId(messageId);
    const updatedMessage = DirectMessage.findByIdAndUpdate(
      messageId,
      {
        $pull: {
          reactions: { userId: user._id },
        },
      },
      { new: true }
    );

    if (!updatedMessage) throw new AppError("Message Not Found", 404);

    return updatedMessage;
  }
}

export default new DirectMessageService();
