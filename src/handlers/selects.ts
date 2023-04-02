import { Bot } from '#structures';
import { SelectMenu } from '#interfaces';
import { getContents, logger } from '#utils';
import { fileURLToPath } from 'url';
import { table } from 'console';

/**
 * Loads all select menus from the 'selects' directory and adds them to the client's 'selects' collection.
 * @param {Bot} client - The Discord client instance.
 * @returns {Promise<void>} - A Promise that resolves when all select menus have been loaded.
 */
export const loadSelects = async (client: Bot): Promise<void> => {
  // Get the absolute path to the 'selects' directory.
  const dirname = fileURLToPath(new URL('../selects', import.meta.url));
  // Get an array of all select menu files in the 'selects' directory and its subdirectories.
  const contents = await getContents<{ select: SelectMenu }>(dirname);
  // Instantiates an array of all successfully loaded select menus.
  const selects = [];

  for (const content of contents) {
    // Extract the select menu object from the content object.
    const { select }: { select: SelectMenu } = content;
    if (select === undefined || select.customId === undefined) {
      logger.error(
        `error exporting select menus, last export: ${
          client.selects.last()?.customId
        }`
      );
      process.exit(1);
    } else {
      // Add the select menu object to the client's 'selects' collection, with its customId as the key.
      try {
        client.selects.set(select.customId, select);
        selects.push({ select: select.customId, status: '🟩' });
      } catch (e) {
        `error exporting select menus, last export: ${
          client.selects.last()?.customId
        }`;
      }
    }
  }

  logger.info(table(selects));
};
