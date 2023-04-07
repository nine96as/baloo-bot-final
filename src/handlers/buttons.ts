import { Bot } from '#structures';
import { Button } from '#interfaces';
import { getContents, logger } from '#utils';
import { fileURLToPath } from 'url';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';

/**
 * Loads all buttons from the 'buttons' directory and adds them to the client's 'buttons' collection.
 * @param {Bot} client - The Discord client instance.
 * @returns {Promise<void>} - A Promise that resolves when all buttons have been loaded.
 */
export const loadButtons = async (client: Bot): Promise<void> => {
  // Get the absolute path to the 'buttons' directory.
  const dirname = fileURLToPath(new URL('../buttons', import.meta.url));
  // Get an array of all button files in the 'buttons' directory and its subdirectories.
  const contents = await getContents<{ button: Button }>(dirname);
  // Instantiates the ascii table renderer.
  const table = new AsciiTable3('buttons')
    .setHeading('name', 'status')
    .setAlignCenter(AlignmentEnum.CENTER)
    .setStyle('compact');

  for (const content of contents) {
    // Extract the button object from the content object.
    const { button }: { button: Button } = content;
    if (button === undefined || button.customId === undefined) {
      logger.error(
        `error exporting buttons, last export: ${
          client.buttons.last()?.customId
        }`
      );
      process.exit(1);
    } else {
      // Add the button object to the client's 'buttons' collection, with its customId as the key.
      try {
        client.buttons.set(button.customId, button);
        table.addRow(button.customId, '🟩');
      } catch (e) {
        `error exporting buttons, last export: ${
          client.buttons.last()?.customId
        }`;
      }
    }
  }

  logger.info(`\n${table.toString()}\nloaded ${client.buttons.size} buttons.`);
};
