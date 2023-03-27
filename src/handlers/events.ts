import { Bot, Event } from '#structures';
import { getContents, logger } from '#functions';
import { fileURLToPath } from 'url';
import { table } from 'console';

/**
 * Loads all events from the 'events' directory and adds them to the client's 'events' collection.
 * @param {Bot} client - The Discord client instance.
 * @returns {Promise<void>} - A Promise that resolves when all events have been loaded.
 */
export const loadEvents = async (client: Bot): Promise<void> => {
  // Get the absolute path to the 'events' directory.
  const dirname = fileURLToPath(new URL('../events/client', import.meta.url));
  // Get an array of all event files in the 'commands' directory and its subdirectories.
  const contents = await getContents(dirname);
  // Instantiates an array of all successfully loaded events.
  const events = [];

  for (const content of contents) {
    try {
      // Extract the button object from the content object.
      const { event }: { event: Event } = content;

      event.once
        ? client.once(event.name, (...args: unknown[]) =>
            event.execute(client, ...args)
          )
        : client.on(event.name, (...args: unknown[]) =>
            event.execute(client, ...args)
          );

      // Add the command object to the client's 'commands' collection, with its name as the key.
      client.events.set(event.name, event);
      events.push({ event: event.name, status: '🟩' });
    } catch (e) {
      logger.error(
        `error exporting events, last export: ${client.events.last()?.name}`
      );
    }
  }

  logger.info(table(events));
};
