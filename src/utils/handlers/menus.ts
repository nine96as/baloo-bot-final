import { Collection } from 'discord.js';
import { join } from 'path';
import logger from '../functions/logger';
import getFiles from '../functions/getFiles';
import SelectMenu from '../../structures/select';
var AsciiTable = require('ascii-table');

const table = new AsciiTable().setHeading('menu', 'status');

export default (): Collection<string, SelectMenu> => {
  const collection: Collection<string, SelectMenu> = new Collection();
  const files = getFiles(
    join(__dirname, '../../interactions/components/menus')
  );

  files.forEach((filePath) => {
    const menu: SelectMenu = require(filePath).default;
    if (menu === undefined || menu.data === undefined) {
      logger.error(
        `file at path ${filePath} seems to be incorrectly be exporting a select menu.`
      );
    } else {
      collection.set(menu.name.toString(), menu);
      table.addRow(menu.name, 'on');
    }
  });

  logger.info(`\n${table.toString()}`);

  return collection;
};
