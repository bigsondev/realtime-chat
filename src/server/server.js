const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const PORT = process.env.port || 3000;
let users = [];

const createNickname = (usersCount) => `User ${usersCount}`;

io.on('connect', (socket) => {
  const usersCount = users.length + 1;
  const nickname = createNickname(usersCount);
  const newUserConnectedMessage = {
    nickname: 'ChatBot',
    text: `${nickname} just arrived, say hi!`,
    timestamp: new Date(),
  };
  const welcomeMessage = {
    nickname: 'ChatBot',
    text: `Hi ${nickname}, be nice :)`,
    timestamp: new Date(),
  };
  const userDisconnectedMessage = {
    nickname: 'ChatBot',
    text: `${nickname} left.`,
    timestamp: new Date(),
  };

  users.push(nickname);

  socket.emit('createUser', {
    nickname,
    usersCount,
    message: welcomeMessage,
  });
  socket.broadcast.emit('newUserConnected', {
    usersCount,
    message: newUserConnectedMessage,
  });

  socket.on('sendMessage', (message) => {
    socket.broadcast.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    users = users.filter((user) => user !== nickname);
    socket.broadcast.emit('userDisconnected', {
      usersCount: usersCount - 1,
      message: userDisconnectedMessage,
    });
  });
});

nextApp
  .prepare()
  .then(() => {
    app.get('*', (req, res) => {
      return nextHandler(req, res);
    });

    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
