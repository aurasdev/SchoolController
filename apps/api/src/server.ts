import { createApp } from './app.js';
import { getPort } from './config/env.js';

const app = createApp();
const port = getPort();

const server = app.listen(port, () => {
  console.log(`School Controller API listening on port ${port}`);
});

function shutdown(signal: NodeJS.Signals) {
  console.log(`Received ${signal}. Closing API server.`);

  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
