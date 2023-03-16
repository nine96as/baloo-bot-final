import { Bot, Button } from '#structures';
import { getContents, logger } from '#functions';
import { fileURLToPath } from 'url';

/**
 * Loads all buttons from the 'buttons' directory and adds them to the client's 'buttons' collection.
 * @param {Bot} client - The Discord client instance.
 * @returns {Promise<void>} - A Promise that resolves when all buttons have been loaded.
 */
export async function loadButtons(client: Bot): Promise<void> {
  // Get the absolute path to the 'buttons' directory.
  const dirname = fileURLToPath(new URL('../buttons', import.meta.url));
  // Get an array of all button files in the 'buttons' directory and its subdirectories.
  const contents = await getContents(dirname);

  for (const content of contents) {
    // Extract the button object from the content object.
    const { button } = content as Button;
    if (button === undefined || button.customId === undefined) {
      logger.error(
        `error exporting button, succeeded in loading ${client.buttons.size} button(s).`
      );
      process.exit(1);
    } else {
      // Add the button object to the client's 'buttons' collection, with its customId as the key.
      client.buttons.set(button.customId, button);
    }
  }

  logger.info(`loaded ${client.buttons.size} button(s).`);
}
