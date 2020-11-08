import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import { Group, Send } from '@material-ui/icons';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { EVENTS } from '../constants';
import chatStyles from '../styles/chat.module.css';
import utilityStyles from '../styles/utility.module.css';

const RealtimeChat = () => {
  const [socket, setSocket] = useState(undefined);
  const [nickname, setNickname] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [usersCount, setUsersCount] = useState(0);
  const chatContentRef = useRef(null);
  const isEmptyMessageText = messageText.length === 0;

  const {
    container,
    chatContainer,
    chatHeaderContainer,
    chatHeader,
    title,
    subtitle,
    onlinePeopleCounterContainer,
    counter,
    chatContentContainer,
    chatFooterContainer,
    inputField,
    sendButton,
    messagesContainer,
    messageContainer,
    myMessageContainer,
    someoneMessageContainer,
    nickname: nicknameClass,
    messageText: messageTextClass,
    timestamp: timestampClass,
  } = chatStyles;
  const { icon, mr8, mb8, mt8, ml16 } = utilityStyles;

  useEffect(() => {
    const newSocket = io();

    newSocket.on(EVENTS.createUser, ({ nickname, usersCount, message }) => {
      setNickname(nickname);
      setUsersCount(usersCount);
      updateMessages(message);
    });
    newSocket.on(EVENTS.newUserConnected, ({ usersCount, message }) => {
      setUsersCount(usersCount);
      updateMessages(message);
    });
    newSocket.on(EVENTS.userDisconnected, ({ usersCount, message }) => {
      setUsersCount(usersCount);
      updateMessages(message);
    });

    newSocket.on(EVENTS.newMessage, (message) => {
      updateMessages(message);
    });

    setSocket(newSocket);
  }, []);

  const scrollToChatBottom = () => {
    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
  };

  const updateMessages = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setTimeout(() => scrollToChatBottom(), 100);
  };

  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
  };

  const handleEnterKey = (event) => {
    if (isEmptyMessageText) {
      return;
    }

    if (event.key === 'Enter' || event.keyCode === 13) {
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes > 9 ? minutes : `0${minutes}`}`;
  };

  const sendMessage = () => {
    if (isEmptyMessageText) {
      return;
    }

    const message = {
      nickname,
      text: messageText,
      timestamp: new Date(),
    };
    socket.emit(EVENTS.sendMessage, message);
    updateMessages(message);
    setMessageText('');
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={container}>
        <div className={chatContainer}>
          <header className={chatHeaderContainer}>
            <div className={chatHeader}>
              <h1 className={title}>Realtime Chat</h1>
              <paragraph className={subtitle}>Chat with everyone.</paragraph>
            </div>
            <div className={onlinePeopleCounterContainer}>
              <Group className={classNames(icon, mr8)} />
              <h4 className={counter}>{usersCount}</h4>
            </div>
          </header>
          <main className={chatContentContainer} ref={chatContentRef}>
            <div className={messagesContainer}>
              {messages.map((message) => {
                const isMyMessage = message.nickname === nickname;

                return isMyMessage ? (
                  <div
                    key={uuidv4()}
                    className={classNames(messageContainer, myMessageContainer)}
                  >
                    <p className={messageTextClass}>{message.text}</p>
                    <span className={classNames(timestampClass, mt8)}>
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                ) : (
                  <div
                    key={uuidv4()}
                    className={classNames(
                      messageContainer,
                      someoneMessageContainer
                    )}
                  >
                    <span className={classNames(nicknameClass, mb8)}>
                      {message.nickname}
                    </span>
                    <p className={messageTextClass}>{message.text}</p>
                    <span className={classNames(timestampClass, mt8)}>
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          </main>
          <footer className={chatFooterContainer}>
            <input
              type="text"
              name="messageText"
              placeholder="Type something..."
              className={inputField}
              value={messageText}
              onChange={handleMessageChange}
              onKeyUp={handleEnterKey}
            />
            <Send
              onClick={sendMessage}
              className={classNames(sendButton, icon, ml16)}
            />
          </footer>
        </div>
      </div>
    </>
  );
};

export default RealtimeChat;
