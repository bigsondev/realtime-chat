export const createNickname = (usersCount) => `User ${usersCount}`;

export const createMessage = ({ nickname, text }) => ({
  nickname: nickname || 'ChatBot',
  text,
  timestamp: new Date(),
});
