import { Bot } from '#structures';
import { getContents, logger } from '#functions';
import { fileURLToPath } from 'url';

export async function loadEvents(client: Bot) {
  const dirname = fileURLToPath(new URL('../events/client', import.meta.url));
  const contents = await getContents(dirname);

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

  logger.info(`loaded client events.`);
}

export async function loadPlayerEvents(client: Bot) {
  const dirname = fileURLToPath(new URL('../events/player', import.meta.url));
  const contents = await getContents(dirname);

  for (const content of contents) {
    const { event } = content;
    if (event.once) {
      client.player.once(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    } else {
      client.player.on(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    }
  }

  logger.info(`loaded player events.`);
}
