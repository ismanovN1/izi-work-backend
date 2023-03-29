import mongoose from "mongoose";
import { chat_schema, message_schema } from "./schema.js";

const Chat = mongoose.model("Chat", chat_schema);
export const Message = mongoose.model("Message", message_schema);

export default Chat;
