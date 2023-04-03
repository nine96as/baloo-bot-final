import { Message } from 'discord.js';
import { EmojiEmbed } from '#interfaces';
import { logger, prisma } from '#utils';

/**
 * Checks for a AfkSystem entry for a specific message author, where the AFK return
 * message is sent if the message author's id matches a currently AFK user's id.
 * @param {Message} message The message to check against.
 * @param {EmojiEmbed} embed The embed message to be sent.
 */
export const sendAfkReturnMessage = async (
  message: Message,
  embed: EmojiEmbed
) => {
  if (
    await prisma.afkSystem.findUnique({
      where: { userId: message.author.id }
    })
  ) {
    try {
      message.channel.send({
        embeds: [embed]
      });
      await prisma.afkSystem.delete({ where: { userId: message.author.id } });
    } catch (e) {
      logger.error(e);
    }
  }
};
