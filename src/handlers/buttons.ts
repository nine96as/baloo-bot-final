import { Collection } from 'discord.js';
import { Button } from '#structures/button';
import { logger } from '#functions/logger';
import { join } from 'path';
import { readdirSync } from 'fs';

export async function loadButtons() {
  const collection: Collection<string, Button> = new Collection();
  const path: string = join('src/buttons');
  const buttons = readdirSync(path);

  buttons.forEach((module) => {
    const modulePath: string = join(path, module)
    const files = readdirSync(modulePath)
      .filter((file) => file.endsWith('.js'));

    files.forEach(async (file) => {
      const filePath = join(modulePath, module, file);
      const { button } = await import(filePath);
      if (button === undefined || button.data === undefined) {
        logger.error(
          `file at path ${path} seems to incorrectly be exporting a button.`
        );
      } else {
        collection.set(button.customId, button);
        // table.addRow(button.customId, 'on');
      }
    });
  });

  logger.info(`loaded buttons.`);

  return collection;
}
