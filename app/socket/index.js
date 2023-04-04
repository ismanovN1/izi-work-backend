import { Chat } from "../models/index.js";

export let online_users = [];

export const onConnection = (io, socket) => {
  const { user_id } = socket.handshake.query;
  socket.join(user_id);
  online_users.push(user_id);
  console.log('new online user', user_id);

  socket.on("message:confirm", async (val) => {
    await Chat.findByIdAndUpdate(val?.chat_id,{[val?.is_employer ? "unread_count_e" : "unread_count_w"]: 0})
  });

  socket.on("disconnect", () => {
    online_users = online_users.filter((item)=>item !== user_id )
    console.log('user is offline', user_id);
  });
};
