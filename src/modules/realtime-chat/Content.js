import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import utilityStyles from '../../styles/utility.module.css';

import realtimeChatStyles from './realtime-chat.module.css';
import { formatTimestamp } from './utils';

const {
  messagesContainer,
  messageContainer,
  myMessageContainer,
  someoneMessageContainer,
  nickname,
  text,
  timestamp,
} = realtimeChatStyles;
const { mb8, mt8 } = utilityStyles;

const MyMessage = ({ message }) => (
  <div
    key={uuidv4()}
    className={classNames(messageContainer, myMessageContainer)}
  >
    <p className={text}>{message.text}</p>
    <span className={classNames(timestamp, mt8)}>
      {formatTimestamp(message.timestamp)}
    </span>
  </div>
);

const SomeoneMessage = ({ message }) => (
  <div
    key={uuidv4()}
    className={classNames(messageContainer, someoneMessageContainer)}
  >
    <span className={classNames(nickname, mb8)}>{message.nickname}</span>
    <p className={text}>{message.text}</p>
    <span className={classNames(timestamp, mt8)}>
      {formatTimestamp(message.timestamp)}
    </span>
  </div>
);

export const Content = ({ data }) => (
  <div className={messagesContainer}>
    {data.messages.map((message) => {
      const isMyMessage = message.nickname === data.nickname;

      return isMyMessage ? (
        <MyMessage message={message} key={uuidv4()} />
      ) : (
        <SomeoneMessage message={message} key={uuidv4()} />
      );
    })}
  </div>
);
