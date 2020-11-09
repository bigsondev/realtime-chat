import classNames from 'classnames';
import { Group } from '@material-ui/icons';

import utilityStyles from '../../styles/utility.module.css';

import realtimeChatStyles from './realtime-chat.module.css';

const {
  chatHeaderContainer,
  chatHeader,
  title,
  subtitle,
  onlinePeopleCounterContainer,
  counter,
} = realtimeChatStyles;
const { icon, mr8 } = utilityStyles;

export const Header = ({ usersCount }) => (
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
);
