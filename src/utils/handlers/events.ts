import { join } from 'path';
import logger from '../functions/logger';
import getFiles from '../functions/getFiles';
import { Bot } from '../../structures/bot';
import { Event } from '../../structures/event';
const AsciiTable = require('ascii-table');

const table = new AsciiTable().setHeading('event', 'status');

export default (client: Bot) => {
  const files = getFiles(join(__dirname, '../../events'));

  files.forEach((filePath) => {
    const event: Event = require(filePath);

    if (event.once) {
      client.once(event.name, (...args: unknown[]) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args: unknown[]) => event.execute(client,...args));
    }
    
    table.addRow(event.name, 'on');
  });

  logger.info(`\n${table.toString()}`);
};
