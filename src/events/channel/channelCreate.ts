import { Events, GuildBasedChannel } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessages } from '#utils';

export const event = {
  name: Events.ChannelCreate,
  execute: (_client: Bot, channel: GuildBasedChannel) => {
    const { guild } = channel;

    return sendLogMessages(
      guild,
      new InfoEmbed(`***channel ${channel} created.***`)
    );
  }
} satisfies Event;
