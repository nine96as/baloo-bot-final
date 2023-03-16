import { Bot, Modal } from '#structures';
import { getContents, logger } from '#functions';
import { fileURLToPath } from 'url';

/**
 * Loads all modals from the 'modals' directory and adds them to the client's 'modals' collection.
 * @param {Bot} client - The Discord client instance.
 * @returns {Promise<void>} - A Promise that resolves when all modals have been loaded.
 */
export async function loadModals(client: Bot) {
  // Get the absolute path to the 'modals' directory.
  const dirname = fileURLToPath(new URL('../modals', import.meta.url));
  // Get an array of all modal files in the 'modals' directory and its subdirectories.
  const contents = await getContents(dirname);

  for (const content of contents) {
    // Extract the modal object from the content object.
    const { modal } = content as Modal;
    if (modal === undefined || modal.customId === undefined) {
      logger.error(
        `error exporting modal, succeeded in loading ${client.modals.size} modal(s).`
      );
    } else {
      // Add the modal object to the client's 'modals' collection, with its customId as the key.
      client.modals.set(modal.customId, modal);
    }
  }

  logger.info(`loaded ${client.modals.size} modal(s).`);
}
