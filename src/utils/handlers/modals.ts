import { Collection } from 'discord.js';
import { join } from 'path';
import logger from '../functions/logger';
import getFiles from '../functions/getFiles';
import { Modal } from '../../structures/modal';
const AsciiTable = require('ascii-table');

const table = new AsciiTable().setHeading('modal', 'status');

export default (): Collection<string, Modal> => {
  const collection: Collection<string, Modal> = new Collection();
  const files = getFiles(
    join(__dirname, '../../interactions/components/modals')
  );

  files.forEach((filePath) => {
    const { modal } = require(filePath);
    if (modal === undefined || modal.customId === undefined) {
      logger.error(
        `file at path ${filePath} seems to incorrectly be exporting a modal.`
      );
    } else {
      collection.set(modal.customId, modal);
      table.addRow(modal.customId, 'on');
    }
  });

  logger.info(`\n${table.toString()}`);

  return collection;
};
