import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Role,
  GuildMember
} from 'discord.js';
import { Command, ErrorEmbed, SuccessEmbed, WarnEmbed } from '#interfaces';
import { getMembers, logger } from '#utils';

export const command = {
  folder: 'moderation',
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('🚨 role management')
    .addSubcommandGroup((group) =>
      group
        .setName('add')
        .setDescription('🚨 add a role to a specific user or all users')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('user')
            .setDescription('🚨 add a role to a user')
            .addUserOption((option) =>
              option
                .setName('target')
                .setDescription('target user')
                .setRequired(true)
            )
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('the role to be added')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('all')
            .setDescription('🚨 add a role to all users')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('the role to be added')
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName('remove')
        .setDescription('🚨 remove a role from a specific user or all users')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('user')
            .setDescription('🚨 remove a role from a user')
            .addUserOption((option) =>
              option
                .setName('target')
                .setDescription('target user')
                .setRequired(true)
            )
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('the role to be removed')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('all')
            .setDescription('🚨 remove a role from all users')
            .addRoleOption((option) =>
              option
                .setName('role')
                .setDescription('the role to be removed')
                .setRequired(true)
            )
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.options.getSubcommandGroup() === 'add') {
      if (interaction.options.getSubcommand() === 'user') {
        if (interaction.inCachedGuild()) {
          const { options } = interaction;
          const member = options.getMember('target') as GuildMember;
          const role = options.getRole('role') as Role;

          if (member.roles.cache.has(role.id))
            return interaction.reply({
              embeds: [
                new WarnEmbed(`***${member} already has the role ${role}`)
              ],
              ephemeral: true
            });

          try {
            await member.roles.add(role).then(() => {
              return interaction.reply({
                embeds: [
                  new SuccessEmbed(`***role ${role} added to ${member}***`)
                ]
              });
            });
          } catch (e) {
            logger.error(e);
            return interaction.reply({
              embeds: [
                new ErrorEmbed(
                  `***Error while adding role ${role} to ${member}***`
                )
              ],
              ephemeral: true
            });
          }
        }
      } else if (interaction.options.getSubcommand() === 'all') {
        if (interaction.inCachedGuild()) {
          const { options, guild } = interaction;
          const role = options.getRole('role') as Role;
          const members = (await getMembers(guild)).filter(
            (m) => !m.roles.cache.has(role.id)
          );
          let fail = false;

          await interaction.deferReply();

          for (const member of members) {
            await member.roles
              .add(role)
              .then(() => {
                return interaction.editReply({
                  embeds: [
                    new SuccessEmbed(`***role ${role} added to ${member}***`)
                  ]
                });
              })
              .catch((e) => {
                logger.error(e);
                fail = true;
              });
          }

          if (fail) {
            return await interaction.followUp({
              embeds: [
                new ErrorEmbed(
                  `***Error while adding role ${role} to \`${members.length.toLocaleString()}\` members. Please make sure that my role is above the target role.***`
                )
              ],
              ephemeral: true
            });
          }

          return await interaction.editReply({
            embeds: [
              new SuccessEmbed(
                `***role ${role} added to \`${members.length.toLocaleString()}\` members.***`
              )
            ]
          });
        }
      }
    } else if (interaction.options.getSubcommandGroup() === 'remove') {
      if (interaction.options.getSubcommand() === 'user') {
        const { options } = interaction;
        const member = options.getMember('target') as GuildMember;
        const role = options.getRole('role') as Role;

        if (!member.roles.cache.has(role.id))
          return interaction.reply({
            embeds: [
              new WarnEmbed(`***${member} doesn't have the role ${role}`)
            ],
            ephemeral: true
          });

        try {
          await member.roles.remove(role).then(() => {
            return interaction.reply({
              embeds: [
                new SuccessEmbed(`***role ${role} removed from ${member}***`)
              ]
            });
          });
        } catch (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [
              new ErrorEmbed(
                `***Error while removing role ${role} from ${member}***`
              )
            ],
            ephemeral: true
          });
        }
      } else if (interaction.options.getSubcommand() === 'all') {
        if (interaction.inCachedGuild()) {
          const { options, guild } = interaction;
          const role = options.getRole('role') as Role;
          const members = (await getMembers(guild)).filter((m) =>
            m.roles.cache.has(role.id)
          );
          let fail = false;

          await interaction.deferReply();

          for (const member of members) {
            await member.roles
              .remove(role)
              .then(() => {
                return interaction.editReply({
                  embeds: [
                    new SuccessEmbed(
                      `***role ${role} removed from ${member}***`
                    )
                  ]
                });
              })
              .catch((e) => {
                logger.error(e);
                fail = true;
              });
          }

          if (fail) {
            return await interaction.followUp({
              embeds: [
                new ErrorEmbed(
                  `***Error while removing role ${role} from \`${members.length.toLocaleString()}\` members. Please make sure that my role is above the target role.***`
                )
              ],
              ephemeral: true
            });
          }

          return await interaction.editReply({
            embeds: [
              new SuccessEmbed(
                `***role ${role} removed from \`${members.length.toLocaleString()}\` members.***`
              )
            ]
          });
        }
      }
    }
  }
} satisfies Command;
