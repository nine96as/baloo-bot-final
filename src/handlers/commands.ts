import { REST, Routes } from 'discord.js';
import { Bot } from '#structures/bot';
import { getContents } from '#functions/getContents';
import { config } from '#functions/config';
import { logger } from '#functions/logger';

const { clientId, developerGuildId, token } = config;

const commandArray: JSON[] = [];
const developerArray: JSON[] = [];

export async function loadCommands(client: Bot) {
  const contents = await getContents('src/commands');

  for (const content of contents) {
    const { command } = content;
    if (command === undefined || command.data === undefined) {
      logger.error(`error exporting command.`);
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

  //loading of developer guild commands
  await rest.put(Routes.applicationGuildCommands(clientId, developerGuildId), {
    body: developerArray
  });

  //loading of global commands
  await rest.put(Routes.applicationCommands(clientId), {
    body: commandArray
  });
}
