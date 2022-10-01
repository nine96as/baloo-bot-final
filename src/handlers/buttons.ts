import { Bot } from '#structures';
import { getContents, logger } from '#functions';
import { fileURLToPath } from 'url';

export async function loadButtons(client: Bot) {
  const dirname = fileURLToPath(new URL('../buttons', import.meta.url));
  const contents = await getContents(dirname);

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
