import { Bot } from '#structures';
import { getContents, logger } from '#functions';
import { fileURLToPath } from 'url';

export async function loadModals(client: Bot) {
  const dirname = fileURLToPath(new URL('../modals', import.meta.url));
  const contents = await getContents(dirname);

  for (const content of contents) {
    const { modal } = content;
    if (modal === undefined || modal.customId === undefined) {
      logger.error(`error exporting modal.`);
    } else {
      client.modals.set(modal.customId, modal);
    }
  }

  logger.info(`loaded ${client.modals.size} modal(s).`);
}
