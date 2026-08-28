import { config } from 'dotenv';

config({ path: '../../.env' });

const DEFAULT_PORT = 4000;

export function getPort() {
  const configuredPort = Number.parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10);

  if (Number.isNaN(configuredPort)) {
    return DEFAULT_PORT;
  }

  return configuredPort;
}
