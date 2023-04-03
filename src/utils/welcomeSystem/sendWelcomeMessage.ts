import { Guild, GuildMember, TextBasedChannel } from 'discord.js';
import { EmojiEmbed } from '#interfaces';
import { generateWelcomeBanner, prisma } from '#utils';

/**
 * Checks for a WelcomeSystem entry for the specific guild, where the welcome
 * message is sent if the entry is found.
 * @param {Guild} guild The guild to check against.
 * @param {GuildMember} member The member that has joined the guild.
 * @param {InfoEmbed} embed The embed message to be sent.
 */
export const sendWelcomeMessage = async (
  guild: Guild,
  member: GuildMember,
  embed: EmojiEmbed
) => {
  // Checks if guild has a WelcomeSystem entry
  const data = await prisma.welcomeSystem.findUnique({
    where: { guildId: guild.id }
  });

  if (!data) return;

  if (data.channelId) {
    const channel = guild.channels.cache.get(
      data.channelId
    ) as TextBasedChannel;

    // If there is no welcome channel, nothing to be done
    if (!channel) return;

    // Otherwise generate and send welcome banner
    const img = await generateWelcomeBanner(member);

    channel.send({
      embeds: [embed],
      files: [img]
    });
  }
};
