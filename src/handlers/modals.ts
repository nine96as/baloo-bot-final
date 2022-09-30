import { Bot } from '#structures';
import { getContents, logger } from '#functions';

export async function loadModals(client: Bot) {
  const contents = await getContents('./src/modals');

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
