import { Bot } from '#structures';
import { getContents, logger } from '#functions';

export async function loadButtons(client: Bot) {
  const contents = await getContents('./src/buttons');

  for (const content of contents) {
    const { button } = content;
    if (button === undefined || button.customId === undefined) {
      logger.error(`error exporting button.`);
    } else {
      client.buttons.set(button.customId, button);
    }
  }

  logger.info(`loaded ${client.buttons.size} button(s).`);
}
