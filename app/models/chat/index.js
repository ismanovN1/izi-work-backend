import mongoose from "mongoose";
import { chat_schema } from "./schema.js";

const Chat = mongoose.model("Chat", chat_schema);

export default Chat;
