import express from 'express';
import http from 'http';
import next from 'next';

import { sockets } from './sockets';

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.Server(app);

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

/**
 * Start sockets.io server
 */
sockets.init(server);

/**
 * Start next.js app
 */
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
