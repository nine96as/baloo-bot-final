import { logger } from '#functions';
import { GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
const { token, clientId, developerGuildId } = process.env;

// If env variables are missing, will output error
if (!token || !clientId || !developerGuildId) {
  logger.error('missing environment variables.');
  process.exit(9);
}

/**
 * Holds a record of .env variables
 */
export const config: Record<string, string> = {
  token,
  clientId,
  developerGuildId
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
