import 'dotenv/config';
import { Collection, REST, Routes } from 'discord.js';
import { join } from 'path';
import logger from '../functions/logger';
import getFiles from '../functions/getFiles';
import { Command } from '../../structures/command';
const AsciiTable = require('ascii-table');

const { clientId, developerGuildId, token } = process.env;

const table = new AsciiTable().setHeading('command', 'status');

const commandArray: JSON[] = [];
const developerArray: JSON[] = [];

export default (): Collection<string, Command> => {
  const collection: Collection<string, Command> = new Collection();
  const files = getFiles(join(__dirname, '../../interactions/commands'));

  files.forEach((filePath) => {
    const { command } = require(filePath);
    if (command === undefined || command.data === undefined) {
      logger.error(
        `file at path ${filePath} seems to incorrectly be exporting a command.`
      );
    } else {
      collection.set(command.data.name, command);
      if (command.developer) {
        developerArray.push(command.data.toJSON());
      } else {
        commandArray.push(command.data.toJSON());
      }

      table.addRow(command.data.name, 'on');
    }
  });

  const rest = new REST({ version: '10' }).setToken(token!);

  //loading of developer guild commands
  rest.put(Routes.applicationGuildCommands(clientId!, developerGuildId!), {
    body: developerArray
  });

  //loading of global commands
  rest.put(Routes.applicationCommands(clientId!), {
    body: commandArray
  });

  logger.info(`\n${table.toString()}`);

  return collection;
};
