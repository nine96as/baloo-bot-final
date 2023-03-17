import { REST, Routes } from 'discord.js';
import { Bot, Command } from '#structures';
import { config, getContents, logger } from '#functions';
import { fileURLToPath } from 'url';
const { clientId, developerGuildId, token } = config;

/**
 * Loads all commands from the 'commands' directory and adds them to the client's 'commands' collection.
 * @param {Bot} client - The Discord client instance.
 * @returns {Promise<void>} - A Promise that resolves when all commands have been loaded.
 */
export async function loadCommands(client: Bot) {
  // Get the absolute path to the 'buttons' directory.
  const dirname = fileURLToPath(new URL('../commands', import.meta.url));
  // Get an array of all command files in the 'commands' directory and its subdirectories.
  const contents = await getContents(dirname);

  for (const content of contents) {
    // Extract the command object from the content object.
    const { command }: { command: Command } = content;
    if (command === undefined || command.data === undefined) {
      logger.error(
        `error exporting commands, last export: ${
          client.commands.last()?.data.name
        }`
      );
      process.exit(1);
    } else {
      // Add the command object to the client's 'commands' collection, with its name as the key.
      client.commands.set(command.data.name, command);
    }
  }

  await deployCommands(client);

  logger.info(`✅ loaded ${client.commands.size} command(s).`);
}

/**
 * Uses the `REST` class from the `discord.js` module to deploy the commands to Discord.
 */
async function deployCommands(client: Bot) {
  const rest = new REST({ version: '10' }).setToken(token);
  const body = client.commands.map((command) => command.data.toJSON());

  // If the environment is production, commands will be registered globally.
  const endpoint =
    process.env.NODE_ENV === 'production'
      ? Routes.applicationCommands(clientId)
      : Routes.applicationGuildCommands(clientId, developerGuildId);

  // Deploying commands to Discord.
  try {
    rest.put(endpoint, { body }).then(() => {
      const response =
        process.env.NODE_ENV === 'production' ? `✅ prod` : `✅ dev`;
      logger.info(response);
    });
  } catch (e) {
    logger.error(e);
  }
}
