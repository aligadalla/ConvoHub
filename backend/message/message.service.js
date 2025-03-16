import { z } from "zod";
import validateInput from "../utils/validateInput.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import Message from "./message.model.js";

class MessageService {
  async sendMessage(user, channelId, file, data) {
    const message = {
      senderId: user._id.toString(),
      channelId: channelId.toString(),
      content: data,
      mediaType: null,
      mediaUrl: null,
      reactions: [],
    };

    const messageSchema = z.object({
      senderId: z.string(),
      channelId: z.string(),
      content: z.string(),
      mediaType: z.string().optional.nullable(),
      mediaUrl: z.string().optional.nullable(),
    });

    const validatedMessage = validateInput(messageSchema, message);
    validatedMessage.channelId = mongoose.Types.ObjectId(channelId);

    const newMessage = await Message.create(validatedMessage);
    return newMessage;
  }

  async deleteMessage(id) {
    id = mongoose.Types.ObjectId(id);
    await Message.findByIdAndDelete(id);
    return "Successfully Deleted!!";
  }

  async getChannelMessages(id) {
    id = mongoose.Types.ObjectId(id);
    const messages = Message.find({ channelId: id }).sort({ createdAt: 1 });
    return messages;
  }

  async addReaction(user, messageId, type) {
    messageId = mongoose.Types.ObjectId(messageId);
    const updatedMessage = Message.findByIdAndUpdate(
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
    messageId = mongoose.Types.ObjectId(messageId);
    const updatedMessage = Message.findByIdAndUpdate(
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

export default new MessageService();
