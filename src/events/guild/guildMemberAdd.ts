import { Events, GuildMember, TextBasedChannel } from 'discord.js';
import { Bot } from '#structures';
import { EmojiEmbed, Event, InfoEmbed } from '#interfaces';
import { generateWelcomeBanner, prisma, sendLogMessages } from '#utils';
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
          new EmojiEmbed(emojis.join, `${member} welcome to **${guild.name}**`)
        ],
        files: [img]
      });
    }

    return sendLogMessages(
      guild,
      new InfoEmbed(`***member ${member} joined the server.***`)
    );
  }
} satisfies Event;
