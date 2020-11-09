export const scrollToChatBottom = (ref) => {
  ref.current.scrollTop = ref.current.scrollHeight;
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes > 9 ? minutes : `0${minutes}`}`;
};

export const mergeMessages = (messages, message) => [...messages, message];
