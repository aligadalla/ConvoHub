import { z } from "zod";
import validateInput from "../utils/validateInput.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import DirectMessage from "./directMessage.model.js";
import User from "../user/user.model.js";

class DirectMessageService {
  async sendMessage(user, id, file, data) {
    id = mongoose.Types.ObjectId(id);
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

    const validateMessage = validateInput(messageSchema, message);

    validateMessage.senderId = mongoose.Types.ObjectId(user._id);
    validatedMessage.receiverId = mongoose.Types.ObjectId(id);

    const newMessage = await DirectMessage.create(validateMessage);
    return newMessage;
  }

  async deleteMessage(id) {
    id = mongoose.Types.ObjectId(id);
    await DirectMessage.findByIdAndDelete(id);
    return "Successfully Deleted!!";
  }

  async getChat(user, id) {
    id = mongoose.Types.ObjectId(id);
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
}

export default new DirectMessageService();
