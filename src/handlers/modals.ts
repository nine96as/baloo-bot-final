import { Collection } from 'discord.js';
import { Modal } from '#structures/modal';
import { logger } from '#functions/logger';
import { join } from 'path';
import { readdir } from 'fs/promises';

export async function loadModals() {
  const collection: Collection<string, Modal> = new Collection();
  const path: string = join('src/modals');
  const files = (await readdir(path))
    .filter((file) => file.endsWith('.js'));

  const fileContents = await Promise.all(
    files.map((path) => import(path))
  );

  for (const modal of fileContents) {
    if (modal === undefined || modal.customId === undefined) {
      logger.error(
        `error exporting ${modal.customId}`
      );
    } else {
      collection.set(modal.customId, modal);
      // table.addRow(modal.customId, 'on');
    }
  }

  logger.info(`loaded modals.`);

  return collection;
}
