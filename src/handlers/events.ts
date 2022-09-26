import { Bot } from '#structures/bot';
import { logger } from '#functions/logger';
import glob from 'tiny-glob';

export async function loadEvents(client: Bot) {
  const files = await glob('src/events/client/**/*.js');
  console.log(files);

  const contents = await Promise.all(
    files.map((path) => import(path))
  );

  console.log(contents);

  for (const file of files) {
    const { event } = await import(file);
    console.log(event.name)
    if (event.once) {
      client.once(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    } else {
      client.on(event.name, (...args: unknown[]) =>
        event.execute(client, ...args)
      );
    }
    // table.addRow(event.name, 'on');
  }

  logger.info(`loaded events.`);
}
