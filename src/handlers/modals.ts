import { Bot } from '#structures';
import { Modal } from '#interfaces';
import { getContents, logger } from '#utils';
import { fileURLToPath } from 'url';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';

/**
 * Loads all modals from the 'modals' directory and adds them to the client's 'modals' collection.
 * @param {Bot} client - The Discord client instance.
 * @returns {Promise<void>} - A Promise that resolves when all modals have been loaded.
 */
export const loadModals = async (client: Bot): Promise<void> => {
  // Get the absolute path to the 'modals' directory.
  const dirname = fileURLToPath(new URL('../modals', import.meta.url));
  // Get an array of all modal files in the 'modals' directory and its subdirectories.
  const contents = await getContents<{ modal: Modal }>(dirname);
  // Instantiates the ascii table renderer.
  const table = new AsciiTable3('modals')
    .setHeading('name', 'status')
    .setAlignCenter(AlignmentEnum.CENTER)
    .setStyle('compact');

  for (const content of contents) {
    // Extract the modal object from the content object.
    const { modal }: { modal: Modal } = content;
    if (modal === undefined || modal.customId === undefined) {
      logger.error(
        `error exporting modals, last export: ${client.modals.last()?.customId}`
      );
    } else {
      // Add the modal object to the client's 'modals' collection, with its customId as the key.
      try {
        client.modals.set(modal.customId, modal);
        table.addRow(modal.customId, '🟩');
      } catch (e) {
        logger.error(
          `error exporting modals, last export: ${
            client.modals.last()?.customId
          }`
        );
      }
    }
  }

  logger.info(`\n${table.toString()}\nloaded ${client.modals.size} modals.`);
};
