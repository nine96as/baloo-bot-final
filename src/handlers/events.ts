import { Bot } from '#structures';
import { Event } from '#interfaces';
import { getContents, logger } from '#utils';
import { fileURLToPath } from 'url';
import { AsciiTable3, AlignmentEnum } from 'ascii-table3';

/**
 * Loads all events from the 'events' directory and adds them to the client's 'events' collection.
 * @param {Bot} client - The Discord client instance.
 * @returns {Promise<void>} - A Promise that resolves when all events have been loaded.
 */
export const loadEvents = async (client: Bot): Promise<void> => {
  // Get the absolute path to the 'events' directory.
  const dirname = fileURLToPath(new URL('../events', import.meta.url));
  // Get an array of all event files in the 'events' directory and its subdirectories.
  const contents = await getContents<{ event: Event }>(dirname);
  // Instantiates the ascii table renderer.
  const table = new AsciiTable3('events')
    .setHeading('name', 'status')
    .setAlignCenter(AlignmentEnum.CENTER)
    .setStyle('compact');

  for (const content of contents) {
    try {
      // Extract the event object from the content object.
      const { event }: { event: Event } = content;

      event.once
        ? client.once(event.name, (...args: unknown[]) =>
            event.execute(client, ...args)
          )
        : client.on(event.name, (...args: unknown[]) =>
            event.execute(client, ...args)
          );

      // Add the event object to the client's 'events' collection, with its name as the key.
      client.events.set(event.name, event);
      table.addRow(event.name, '🟩');
    } catch (e) {
      logger.error(
        `error exporting events, last export: ${client.events.last()?.name}`
      );
    }
  }

  logger.info(`\n${table.toString()}\nloaded ${client.events.size} events.`);
};
