import { REST, Routes } from 'discord.js';
import { Bot, Command } from '#structures';
import { config, getContents, logger } from '#functions';
import { fileURLToPath } from 'url';
const { clientId, developerGuildId, token } = config;

const commandArray: JSON[] = [];
const developerArray: JSON[] = [];

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
    const { command } = content as Command;
    if (command === undefined || command.data === undefined) {
      logger.error(
        `error exporting commands, succeeded in loading ${client.commands.size} command(s).`
      );
      process.exit(1);
    } else {
      // Add the command object to the client's 'commands' collection, with its name as the key.
      client.commands.set(command.data.name, command);
      // Add the command object to the `commandArray` or `developerArray`, depending on whether the `developer` boolean value was added.
      if (command.developer) {
        developerArray.push(command.data.toJSON());
      } else {
        commandArray.push(command.data.toJSON());
      }
    }
  }

  await deployCommands();

  logger.info(`loaded ${client.commands.size} command(s).`);
}

/**
 * Uses the `REST` class from the `discord.js` module to deploy the commands to Discord.
 */
async function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(token);

  await Promise.all([
    // Loading of developer guild commands
    rest.put(Routes.applicationGuildCommands(clientId, developerGuildId), {
      body: developerArray
    }),
    // Loading of global commands
    rest.put(Routes.applicationCommands(clientId), {
      body: commandArray
    })
  ]);
}
