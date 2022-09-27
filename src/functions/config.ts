import { logger } from '#functions/logger';
import 'dotenv/config';
const { token, clientId, developerGuildId } = process.env;

if (!token || !clientId || !developerGuildId) {
  logger.error('missing environment variables.');
  process.exit(9);
}

export const config: Record<string, string> = {
  token,
  clientId,
  developerGuildId
};
