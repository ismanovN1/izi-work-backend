import { Chat } from "../models/index.js";

export let online_users = new Set()

export const onConnection = (io, socket) => {
  const { user_id } = socket.handshake.query;
  socket.join(user_id);
  online_users.add(user_id);

  socket.on("message:confirm", async (val) => {
    if(val.to_whom) io.to(val?.to_whom).emit("message:readed", val?.chat_id );

    await Chat.findByIdAndUpdate(val?.chat_id,{[val?.is_employer ? "unread_count_e" : "unread_count_w"]: 0})
    

  });

  socket.on("disconnect", () => {
    online_users.delete(user_id)
  });
};
