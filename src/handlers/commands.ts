import { REST, Routes } from 'discord.js';
import { Bot } from '#structures/bot';
import { logger } from '#functions/logger';
import 'dotenv/config';
import glob from 'tiny-glob';

const { clientId, developerGuildId, token } = process.env;

const commandArray: JSON[] = [];
const developerArray: JSON[] = [];

export async function loadCommands(client: Bot) {
  const files = await glob('src/commands/**/*.js');

  const contents = await Promise.all(
    files.map((path) => import(path))
  );

  console.log(contents);

  for (const command of contents) {
    if (command === undefined || command.data === undefined) {
      logger.error(
        `error exporting ${command.data.name}`
      );
    } else {
      client.commands.set(command.data.name, command);
      // table.addRow(modal.customId, 'on');
    }
  }

  deployCommands();

  logger.info(`loaded commands.`);
}

function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(token!);

  //loading of developer guild commands
  rest.put(Routes.applicationGuildCommands(clientId!, developerGuildId!), {
    body: developerArray
  });

  //loading of global commands
  rest.put(Routes.applicationCommands(clientId!), {
    body: commandArray
  });
}
