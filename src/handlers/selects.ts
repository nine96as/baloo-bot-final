import { Bot } from '#structures';
import { getContents, logger } from '#functions';
import { fileURLToPath } from 'url';

export async function loadSelects(client: Bot) {
  const dirname = fileURLToPath(new URL('../selects', import.meta.url));
  const contents = await getContents(dirname);

  for (const content of contents) {
    const { select } = content;
    if (select === undefined || select.customId === undefined) {
      logger.error(`error exporting select menu.`);
    } else {
      client.selects.set(select.customId, select);
    }
  }

  logger.info(`loaded ${client.selects.size} select menu(s).`);
}
