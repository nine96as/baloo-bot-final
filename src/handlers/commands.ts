import { REST, Routes } from 'discord.js';
import { Bot } from '#structures';
import { config, getContents, logger } from '#functions';
import { fileURLToPath } from 'url';
const { clientId, developerGuildId, token } = config;

const commandArray: JSON[] = [];
const developerArray: JSON[] = [];

export async function loadCommands(client: Bot) {
  const dirname = fileURLToPath(new URL('../commands', import.meta.url));
  const contents = await getContents(dirname);

  for (const content of contents) {
    const { command } = content;
    if (command === undefined || command.data === undefined) {
      logger.error(`error exporting commands.`);
    } else {
      client.commands.set(command.data.name, command);
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

async function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(token);

  await Promise.all([
    //loading of developer guild commands
    rest.put(Routes.applicationGuildCommands(clientId, developerGuildId), {
      body: developerArray
    }),
    //loading of global commands
    rest.put(Routes.applicationCommands(clientId), {
      body: commandArray
    })
  ]);
}
