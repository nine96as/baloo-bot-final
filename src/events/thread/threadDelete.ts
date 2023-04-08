import { Event } from '#interfaces';
import { Bot } from '#structures';
import { logger, prisma } from '#utils';
import { Events, ThreadChannel } from 'discord.js';

export const event = {
  name: Events.ThreadDelete,
  execute: async (_client: Bot, thread: ThreadChannel) => {
    if (!thread || !thread.parentId) return;

    const { name } = thread;

    try {
      await prisma.thread
        .delete({ where: { threadId: thread.id } })
        .then(() => {
          logger.info(`thread [${name}] (${thread.id}) successfully deleted.`, {
            label: 'event'
          });
        });
    } catch (e) {
      logger.error(e);
    }
  }
} satisfies Event;
