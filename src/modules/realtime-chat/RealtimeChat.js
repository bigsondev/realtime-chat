import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import { EVENTS } from '../../constants';

import { Header } from './Header';
import { Content } from './Content';
import { Footer } from './Footer';
import { scrollToChatBottom, mergeMessages } from './utils';
import realtimeChatStyles from './realtime-chat.module.css';

const { container, chatContainer, chatContentContainer } = realtimeChatStyles;

export const RealtimeChat = () => {
  const [socket, setSocket] = useState(undefined);
  const [data, setData] = useState({
    messages: [],
    nickname: '',
    usersCount: 0,
  });
  const [messageText, setMessageText] = useState('');
  const chatContentRef = useRef(null);
  const isEmptyMessageText = messageText.length === 0;

  const handleMessageSend = () => {
    if (isEmptyMessageText) {
      return;
    }

    const message = {
      nickname: data.nickname,
      text: messageText,
      timestamp: new Date(),
    };

    socket.emit(EVENTS.sendMessage, message);
    setData({ ...data, messages: mergeMessages(data.messages, message) });
    setMessageText('');
  };

  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (isEmptyMessageText) {
      return;
    }

    if (event.key === 'Enter' || event.keyCode === 13) {
      handleMessageSend();
    }
  };

  useEffect(() => {
    const socket = io();

    socket.on(EVENTS.createUser, ({ nickname, usersCount, message }) => {
      setData((prevData) => ({
        messages: mergeMessages(prevData.messages, message),
        nickname,
        usersCount,
      }));
    });
    socket.on(EVENTS.newUserConnected, ({ usersCount, message }) => {
      setData((prevData) => ({
        ...prevData,
        messages: mergeMessages(prevData.messages, message),
        usersCount,
      }));
    });
    socket.on(EVENTS.userDisconnected, ({ usersCount, message }) => {
      setData((prevData) => ({
        ...prevData,
        messages: mergeMessages(prevData.messages, message),
        usersCount,
      }));
    });

    socket.on(EVENTS.newMessage, (message) => {
      setData((prevData) => ({
        ...prevData,
        messages: mergeMessages(prevData.messages, message),
      }));
    });

    setSocket(socket);
  }, []);

  useEffect(() => {
    setTimeout(() => scrollToChatBottom(chatContentRef), 100);
  }, [data.messages]);

  return (
    <>
      <div className={container}>
        <div className={chatContainer}>
          <Header usersCount={data.usersCount} />
          {/* Just to avoid ref forwarding */}
          <main className={chatContentContainer} ref={chatContentRef}>
            <Content data={data} forward={chatContentRef} />
          </main>
          <Footer
            messageText={messageText}
            onMessageChange={handleMessageChange}
            onEnterKeyPress={handleEnterKeyPress}
            onMessageSend={handleMessageSend}
          />
        </div>
      </div>
    </>
  );
};
