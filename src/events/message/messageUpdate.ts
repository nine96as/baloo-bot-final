import { Message, Events } from 'discord.js';
import { Bot } from '#structures';
import { Event, InfoEmbed } from '#interfaces';
import { sendLogMessages } from '#utils';

export const event = {
  name: Events.MessageUpdate,
  execute: (_client: Bot, message: Message, newContent: Message) => {
    const { guild, author, content, channel } = message;

    if (!guild) return;

    if (message.author.bot) return;

    return sendLogMessages(
      guild,
      new InfoEmbed(`***message edited by ${author} in ${channel}*\n
      before:** \`${content}\`\n
      **after:** \`${newContent}\``)
    );
  }
} satisfies Event;
