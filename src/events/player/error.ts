import { BaseGuildTextChannel } from 'discord.js';
import { DMPError, Queue } from 'discord-music-player';
import { Bot, ErrorEmbed, PlayerEvent } from '#structures';
import { logger } from '#functions';

export const event: PlayerEvent = {
  name: 'error',
  async execute(client: Bot, error: DMPError, queue: Queue) {
    const data = queue.data as any;
    const channelId = data.channelId;
    const channel = client.channels.cache.get(
      channelId
    ) as BaseGuildTextChannel;

    logger.error(`${error} in ${queue.guild.name}`);
    await channel.send({
      embeds: [new ErrorEmbed('***playerError***')]
    });
  }
};
