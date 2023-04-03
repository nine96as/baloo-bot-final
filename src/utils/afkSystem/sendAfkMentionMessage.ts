import { Message } from 'discord.js';
import { EmojiEmbed } from '#interfaces';
import { prisma } from '#utils';
import { emojis } from '#assets';

/**
 * For every mention within a given message, checks for a AfkSystem entry for
 * the mentioned user, where the AFK mention message is sent if the mentioned user's
 * id matches a currently AFK user's id.
 * @param {Message} message The message to check against.
 */
export const sendAfkMentionMessage = async (message: Message) => {
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
};
