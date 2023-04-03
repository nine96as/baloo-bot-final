import { Events, GuildBasedChannel } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessage } from '#utils';

export const event = {
  name: Events.ChannelCreate,
  execute: (_client: Bot, channel: GuildBasedChannel) => {
    const { guild } = channel;

    return sendLogMessage(
      guild,
      new InfoEmbed(`***channel ${channel} created.***`)
    );
  }
} satisfies Event;
