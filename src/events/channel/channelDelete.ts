import { Events, GuildBasedChannel } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessages } from '#utils';

export const event = {
  name: Events.ChannelDelete,
  execute: (_client: Bot, channel: GuildBasedChannel) => {
    const { guild, name } = channel;

    return sendLogMessages(
      guild,
      new InfoEmbed(`***channel*** \`${name}\` ***deleted.***`)
    );
  }
} satisfies Event;
