import 'dotenv/config';
import { logger } from '#functions';
import { GatewayIntentBits } from 'discord.js';
import { env } from 'process';
const { token, clientId, openAIKey, databaseUrl } = env;

// If env variables are missing, will output error
if (!token || !clientId || !openAIKey || !databaseUrl) {
  logger.fatal('missing environment variables.');
  process.exit(9);
}

/**
 * Holds a record of .env variables
 */
export const config: Record<string, string> = {
  token,
  clientId,
  openAIKey,
  databaseUrl
};

/**
 * Holds the client intents that the bot will use
 * - Guilds: Allows bot to see guilds
 * - GuildMembers: Allows bot to see guild members
 * - GuildMessages: Allows bot to see guild messages
 * - GuildVoiceStates: Allows bot to see guild voice states
 */
export const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildVoiceStates
];
