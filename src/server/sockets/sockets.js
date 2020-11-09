import socketIo from 'socket.io';

import { EVENTS } from '../../constants';
import { createMessage, createNickname } from './utils';

const init = (server) => {
  const io = socketIo(server);
  let users = [];

  io.on(EVENTS.connect, (socket) => {
    const usersCount = users.length + 1;
    const nickname = createNickname(usersCount);
    const newUserConnectedMessage = createMessage({
      text: `${nickname} just arrived, say hi!`,
    });
    const welcomeMessage = createMessage({
      text: `Hi ${nickname}, be nice :)`,
    });
    const userDisconnectedMessage = createMessage({
      text: `${nickname} left.`,
    });

    users.push(nickname);

    socket.emit(EVENTS.createUser, {
      nickname,
      usersCount,
      message: welcomeMessage,
    });
    socket.broadcast.emit(EVENTS.newUserConnected, {
      usersCount,
      message: newUserConnectedMessage,
    });

    socket.on(EVENTS.sendMessage, (message) => {
      socket.broadcast.emit(EVENTS.newMessage, message);
    });
    socket.on(EVENTS.disconnect, () => {
      users = users.filter((user) => user !== nickname);
      socket.broadcast.emit(EVENTS.userDisconnected, {
        usersCount: usersCount - 1,
        message: userDisconnectedMessage,
      });
    });
  });
};

export const sockets = {
  init,
};
