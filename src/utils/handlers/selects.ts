import { Collection } from 'discord.js';
import { join } from 'path';
import logger from '../functions/logger';
import getFiles from '../functions/getFiles';
import { SelectMenu } from '../../structures/select';
const AsciiTable = require('ascii-table');

const table = new AsciiTable().setHeading('select', 'status');

export default (): Collection<string, SelectMenu> => {
  const collection: Collection<string, SelectMenu> = new Collection();
  const files = getFiles(
    join(__dirname, '../../interactions/components/selects')
  );

  files.forEach((filePath) => {
    const { select } = require(filePath);
    if (select === undefined || select.customId === undefined) {
      logger.error(
        `file at path ${filePath} seems to be incorrectly be exporting a select menu.`
      );
    } else {
      collection.set(select.customId, select);
      table.addRow(select.customId, 'on');
    }
  });

  logger.info(`\n${table.toString()}`);

  return collection;
};
