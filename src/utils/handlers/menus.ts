import { Collection } from 'discord.js';
import { join } from 'path';
import logger from '../functions/logger';
import getFiles from '../functions/getFiles';
import { SelectMenu } from '../../structures/select';
const AsciiTable = require('ascii-table');

const table = new AsciiTable().setHeading('menu', 'status');

export default (): Collection<string, SelectMenu> => {
  const collection: Collection<string, SelectMenu> = new Collection();
  const files = getFiles(
    join(__dirname, '../../interactions/components/selects')
  );

  files.forEach((filePath) => {
    const menu: SelectMenu = require(filePath);
    if (menu === undefined || menu.customId === undefined) {
      logger.error(
        `file at path ${filePath} seems to be incorrectly be exporting a select menu.`
      );
    } else {
      collection.set(menu.customId.toString(), menu);
      table.addRow(menu.customId, 'on');
    }
  });

  logger.info(`\n${table.toString()}`);

  return collection;
};
