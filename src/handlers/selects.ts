import { Bot, SelectMenu } from '#structures';
import { getContents, logger } from '#functions';
import { fileURLToPath } from 'url';

/**
 * Loads all select menus from the 'selects' directory and adds them to the client's 'selects' collection.
 * @param {Bot} client - The Discord client instance.
 * @returns {Promise<void>} - A Promise that resolves when all select menus have been loaded.
 */
export async function loadSelects(client: Bot) {
  // Get the absolute path to the 'selects' directory.
  const dirname = fileURLToPath(new URL('../selects', import.meta.url));
  // Get an array of all select menu files in the 'selects' directory and its subdirectories.
  const contents = await getContents(dirname);

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
      client.selects.set(select.customId, select);
    }
  }

  logger.info(`✅ loaded ${client.selects.size} select menu(s).`);
}
