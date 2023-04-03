import { Events, GuildMember, TextBasedChannel } from 'discord.js';
import { Bot } from '#structures';
import { EmojiEmbed, Event, InfoEmbed } from '#interfaces';
import { prisma, sendLogMessages } from '#utils';
import { emojis } from '#assets';

export const event = {
  name: Events.GuildMemberRemove,
  execute: async (_client: Bot, member: GuildMember) => {
    const { guild, id } = member;

    // Checks if guild has a LeaveSystem entry
    const data = await prisma.leaveSystem.findUnique({
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

      // If there is no welcome channel, nothing to be done
      if (!channel) return;

      channel.send({
        embeds: [
          new EmojiEmbed(emojis.leave, `${member} cya!`).setFooter({
            text: `there are now ${guild.memberCount} members.`
          })
        ]
      });
    }

    return sendLogMessages(
      guild,
      new InfoEmbed(`***member ${member} left the server.***`)
    );
  }
} satisfies Event;
