import { Events, GuildMember, TextBasedChannel } from 'discord.js';
import { Bot } from '#structures';
import { Event } from '#interfaces';
import { generateWelcomeBanner, prisma } from '#utils';

export const event: Event = {
  name: Events.GuildMemberAdd,
  async execute(_client: Bot, member: GuildMember) {
    const { guild } = member;

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
        content: `<@${member.id}> welcome to **${guild.name}**`,
        files: [img]
      });
    }
  }
};
