import { Collection } from 'discord.js';
import { SelectMenu } from '#structures/select';
import { logger } from '#functions/logger';
import { join, dirname } from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadSelects() {
  const collection: Collection<string, SelectMenu> = new Collection();
  const path: string = join('src/selects');
  const selects = readdirSync(path);

  selects.forEach(async (file) => {
    const filePath = join(path, file);
    const { select } = await import(filePath);
    if (select === undefined || select.customId === undefined) {
      logger.error(
        `file at path ${filePath} seems to incorrectly be exporting a select menu.`
      );
    } else {
      collection.set(select.customId, select);
      // table.addRow(select.customId, 'on');
    }
  });

  logger.info(`loaded select menus.`);

  return collection;
}
