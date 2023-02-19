import { GuildTextBasedChannel } from 'discord.js';
import { Queue } from 'discord-music-player';
import { Bot, InfoEmbed, PlayerEvent } from '#structures';

export const event: PlayerEvent = {
  name: 'queueEnd',
  async execute(client: Bot, queue: Queue) {
    const data = queue.data as any;
    const channelId = data.channelId;
    const channel = client.channels.cache.get(
      channelId
    ) as GuildTextBasedChannel;

    await channel.send({
      embeds: [new InfoEmbed('***the queue is empty, leaving the channel***')]
    });
  }
};
