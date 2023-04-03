import { Guild, TextBasedChannel } from 'discord.js';
import { InfoEmbed } from '#interfaces';
import { prisma } from '#utils';

/**
 * Checks for LogSystem entry for the specific guild, where the log message is
 * sent if this entry is found.
 * @param {Guild} guild The guild to check against.
 * @param {InfoEmbed} embed The embed message to be sent.
 */
export const sendLogMessages = async (guild: Guild, embed: InfoEmbed) => {
  // Checks if guild has a LogSystem entry
  const data = await prisma.logSystem.findUnique({
    where: { guildId: guild.id }
  });

  if (!data) return;

  if (data.channelId) {
    const channel = guild.channels.cache.get(
      data.channelId
    ) as TextBasedChannel;

    // If there is no log channel, nothing to be done
    if (!channel) return;

    channel.send({
      embeds: [embed]
    });
  }
};
