import { Guild, GuildMember, TextBasedChannel } from 'discord.js';
import { EmojiEmbed } from '#interfaces';
import { prisma } from '#utils';

/**
 * Checks for a LeaveSystem entry for the specific guild, where the leave
 * message is sent if the entry is found.
 * @param {Guild} guild The guild to check against.
 * @param {GuildMember} member The member that has left the guild.
 * @param {InfoEmbed} embed The embed message to be sent.
 */
export const sendLeaveMessage = async (
  guild: Guild,
  member: GuildMember,
  embed: EmojiEmbed
) => {
  const { id } = member;

  // Checks if guild has a LeaveSystem entry
  const data = await prisma.welcomeSystem.findUnique({
    where: { guildId: guild.id }
  });

  if (!data) return;

  // Checks if user is registered in db
  const user = await prisma.user.findUnique({
    where: { userId: id }
  });

  if (user)
    prisma.user.delete({
      where: { userId: id }
    });

  if (data.channelId) {
    const channel = guild.channels.cache.get(
      data.channelId
    ) as TextBasedChannel;

    // If there is no leave channel, nothing to be done
    if (!channel) return;

    channel.send({
      embeds: [embed]
    });
  }
};
