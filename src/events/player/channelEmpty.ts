import { BaseGuildTextChannel } from 'discord.js';
import { Queue } from 'discord-music-player';
import { Bot, InfoEmbed, PlayerEvent } from '#structures';

export const event: PlayerEvent = {
  name: 'channelEmpty',
  async execute(client: Bot, queue: Queue) {
    const data = queue.data as any;
    const channelId = data.channelId;
    const channel = client.channels.cache.get(
      channelId
    ) as BaseGuildTextChannel;

    await channel.send({
      embeds: [
        new InfoEmbed(`***${channel.name}** is empty, leaving the channel.*`)
      ]
    });
  }
};
