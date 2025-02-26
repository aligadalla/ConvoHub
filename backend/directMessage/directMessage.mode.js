import mongoose from "mongoose";

const directMessageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    mediaType: { type: String, enum: ["text", "image", "video", "voice"], required: true },
    mediaUrl: { type: String },
  },
  { timestamps: true }
);

const DirectMessage = mongoose.model("DirectMessage", directMessageSchema);
export default DirectMessage;
