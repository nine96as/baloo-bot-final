import { Events, GuildMember, TextBasedChannel } from 'discord.js';
import { Bot } from '#structures';
import { EmojiEmbed, Event } from '#interfaces';
import { generateWelcomeBanner, prisma } from '#utils';
import { emojis } from '#assets';

export const event = {
  name: Events.GuildMemberAdd,
  execute: async (_client: Bot, member: GuildMember) => {
    const { guild } = member;

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
        embeds: [
          new EmojiEmbed(
            emojis.join,
            `<@${member.id}> welcome to **${guild.name}**`
          )
        ],
        files: [img]
      });
    }
  }
} satisfies Event;
