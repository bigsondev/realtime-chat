import classNames from 'classnames';
import { Send } from '@material-ui/icons';

import utilityStyles from '../../styles/utility.module.css';

import realtimeChatStyles from './realtime-chat.module.css';

const { chatFooterContainer, inputField, sendButton } = realtimeChatStyles;
const { icon, ml16 } = utilityStyles;

export const Footer = ({
  messageText,
  onMessageChange,
  onEnterKeyPress,
  onMessageSend,
}) => (
  <footer className={chatFooterContainer}>
    <input
      type="text"
      name="messageText"
      placeholder="Type something..."
      className={inputField}
      value={messageText}
      onChange={onMessageChange}
      onKeyUp={onEnterKeyPress}
    />
    <Send
      onClick={onMessageSend}
      className={classNames(sendButton, icon, ml16)}
    />
  </footer>
);
