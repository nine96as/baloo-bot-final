import { Bot } from '#structures';
import { config } from '#functions';

/**
 * Creates a new instance of the Bot class and passes in a Discord bot token,
 * which is retrieved from the config object using the token property.
 */
new Bot(config.token);
