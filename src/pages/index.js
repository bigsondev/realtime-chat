import Head from 'next/head';

import { RealtimeChat } from '../modules';

const Home = () => (
  <>
    <Head>
      <title>Realtime Chat</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <RealtimeChat />
  </>
);

export default Home;
