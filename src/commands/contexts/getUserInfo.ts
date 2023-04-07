import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  time
} from 'discord.js';
import { Command, Embed } from '#interfaces';
import { badgeEmojis } from '#assets';

export const command = {
  folder: 'context',
  data: new ContextMenuCommandBuilder()
    .setName('getUserInfo')
    .setType(ApplicationCommandType.User),
  execute: async (interaction: UserContextMenuCommandInteraction) => {
    if (interaction.inCachedGuild()) {
      const { targetMember, guild } = interaction;
      const member = targetMember;

      const badges = [];
      if (member.user.id === guild.ownerId) badges.push('owner');
      if (member.permissions.has('ModerateMembers')) {
        badges.push('staff');
      } else {
        badges.push('member');
      }
      if (member.premiumSince) badges.push('booster');
      if (member.user.bot) badges.push('bot');

      return await interaction.reply({
        embeds: [
          new Embed()
            .setColor('Random')
            .setAuthor({
              iconURL: member.user.displayAvatarURL(),
              name: member.user.tag
            })
            .setDescription(
              `${member} ${badges.map((b) => badgeEmojis[b]).join(' ')}`
            )
            .setFooter({
              text: `ID: ${member.user.id}`
            })
            .setTimestamp()
            .setThumbnail(member.user.avatarURL({ size: 4096 }))
            .addFields(
              {
                name: 'joined',
                value:
                  `${time(member.joinedAt as Date)} ` +
                  `(${time(member.joinedAt as Date, 'R')})`
              },
              {
                name: 'registered',
                value:
                  `${time(member.user.createdAt)} ` +
                  `(${time(member.user.createdAt, 'R')})`
              },
              {
                name: `roles (\`${member.roles.cache.size - 1}\`)`,
                value: `${
                  member.roles.cache
                    .map((r) => r)
                    .join(' ')
                    .replace('@everyone', '') || 'none'
                }`
              },
              {
                name: `permissions (\`${
                  member.permissions.toArray().length
                }\`)`,
                value: `${
                  member.permissions.toArray().includes('Administrator')
                    ? 'Administrator'
                    : member.permissions
                        .toArray()
                        .map((p) => p)
                        .join(', ')
                        .replace('_', ' ') || 'none'
                }`
              }
            )
        ]
      });
    }
  }
} satisfies Command;
