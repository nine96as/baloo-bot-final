import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  time,
  ChannelType
} from 'discord.js';
import { Command, Embed } from '#structures';
import { emojis } from '#assets';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('🔬 get info about a user or server')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('🔬 info about a user')
        .addUserOption((option) =>
          option.setName('target').setDescription('the user')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('server').setDescription('🔬 info about the server')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'user') {
      if (interaction.inCachedGuild()) {
        const { options, guild } = interaction;

        const member = options.getMember('target') || interaction.member;

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
                // @ts-ignore
                `${member} ${badges.map((b) => emojis.badge[b]).join(' ')}`
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
    } else if (interaction.options.getSubcommand() === 'server') {
      if (interaction.inCachedGuild()) {
        const { guild } = interaction;

        return await interaction.reply({
          embeds: [
            new Embed()
              .setColor('Random')
              .setAuthor({
                name: guild.name,
                iconURL: guild.iconURL() || undefined
              })
              .setThumbnail(guild.iconURL({ size: 4096 }))
              .setFooter({
                text: `ID: ${guild.id}`
              })
              .setTimestamp()
              .addFields(
                { name: 'owner', value: `<@${guild.ownerId}>` },
                {
                  name: 'total members',
                  value: `${guild.memberCount}`,
                  inline: true
                },
                {
                  name: 'total roles',
                  value: `${guild.roles.cache.size}`,
                  inline: true
                },
                { name: '\u200B', value: '\u200B' },
                {
                  name: 'text channels',
                  value: `${
                    guild.channels.cache.filter(
                      (c) => c.type === ChannelType.GuildText
                    ).size
                  }`,
                  inline: true
                },
                {
                  name: 'voice channels',
                  value: `${
                    guild.channels.cache.filter(
                      (c) => c.type === ChannelType.GuildVoice
                    ).size
                  }`,
                  inline: true
                },
                {
                  name: 'role list',
                  value: `${
                    guild.roles.cache.map((r) => r).join(' ') || 'none'
                  }`
                },
                {
                  name: 'created at',
                  value:
                    `${time(guild.createdAt)} ` +
                    `(${time(guild.createdAt, 'R')})`
                }
              )
          ]
        });
      }
    }
  }
};
