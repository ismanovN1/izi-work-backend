export let online_users = [];

export const onConnection = (io, socket) => {
  const { user_id } = socket.handshake.query;
  socket.join(user_id);
  online_users.push(user_id);
  console.log('new online user', user_id);

  socket.on("disconnect", () => {
    online_users = online_users.filter((item)=>item !== user_id )
    console.log('user is offline', user_id);

  });
};
