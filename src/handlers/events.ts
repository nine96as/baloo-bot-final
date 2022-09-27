import { Bot } from '#structures';
import { getContents, logger } from '#functions';

export async function loadEvents(client: Bot) {
  const contents = await getContents('src/events/client');

  for (const content of contents) {
    const { event } = content;
    if (event.once) {
      client.once(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    } else {
      client.on(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    }
  }

  logger.info(`loaded events.`);
}
