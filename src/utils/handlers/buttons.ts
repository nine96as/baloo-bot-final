import { Collection } from 'discord.js';
import { join } from 'path';
import logger from '../functions/logger';
import getFiles from '../functions/getFiles';
import { Button } from '../../structures/button';
const AsciiTable = require('ascii-table');

const table = new AsciiTable().setHeading('button', 'status');

export default (): Collection<string, Button> => {
  const collection: Collection<string, Button> = new Collection();
  const files = getFiles(
    join(__dirname, '../../interactions/components/buttons')
  );

  files.forEach((filePath) => {
    const { button } = require(filePath);
    if (button === undefined || button.customId === undefined) {
      logger.error(
        `file at path ${filePath} seems to be incorrectly be exporting a button.`
      );
    } else {
      collection.set(button.customId, button);
      table.addRow(button.customId, 'on');
    }
  });

  logger.info(`\n${table.toString()}`);

  return collection;
};
