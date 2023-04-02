import { Message, Events } from 'discord.js';
import { Bot } from '#structures';
import { EmojiEmbed, Event } from '#interfaces';
import { logger, prisma } from '#utils';
import { emojis } from '#assets';

export const event = {
  name: Events.MessageCreate,
  execute: async (_client: Bot, message: Message) => {
    if (message.author.bot) return;

    if (
      await prisma.afkSystem.findUnique({
        where: { userId: message.author.id }
      })
    ) {
      try {
        message.channel.send({
          embeds: [
            new EmojiEmbed(
              emojis.return,
              `***${message.author}: welcome back, your AFK has been removed.***`
            )
          ]
        });
        await prisma.afkSystem.delete({ where: { userId: message.author.id } });
      } catch (e) {
        logger.error(e);
      }
    }

    if (message.mentions.members?.size) {
      message.mentions.members.forEach(async (m) => {
        const data = await prisma.afkSystem.findUnique({
          where: { userId: m.id }
        });

        if (!data) return;

        if (data.userId) {
          message.reply({
            embeds: [
              new EmojiEmbed(
                emojis.afk,
                `***${m} is AFK: \`${data.status}\` - <t:${Math.floor(
                  data.createdAt.getTime() / 1000
                )}:R>***`
              )
            ]
          });
        }
      });
    }
  }
} satisfies Event;
