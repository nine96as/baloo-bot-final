import { Events, GuildBasedChannel } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessages } from '#utils';

export const event = {
  name: Events.ChannelUpdate,
  execute: (
    _client: Bot,
    oldChannel: GuildBasedChannel,
    newChannel: GuildBasedChannel
  ) => {
    const { guild } = newChannel;

    if (oldChannel.name != newChannel.name) {
      return sendLogMessages(
        guild,
        new InfoEmbed(
          `***channel*** \`${oldChannel.name}\` ***renamed to*** \`${newChannel.name}\``
        )
      );
    }
  }
} satisfies Event;
