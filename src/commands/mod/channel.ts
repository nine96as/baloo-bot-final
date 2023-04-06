import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  AutocompleteInteraction,
  ChannelType,
  CategoryChannelResolvable,
  Role,
  GuildTextBasedChannel,
  BaseGuildVoiceChannel,
  ForumChannel,
  StageChannel,
  CategoryChannel
} from 'discord.js';
import { Command, ErrorEmbed, SuccessEmbed } from '#interfaces';
import { logger } from '#utils';

export const command = {
  data: new SlashCommandBuilder()
    .setName('channel')
    .setDescription('🚨 channel management')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('🚨 create a text/voice channel')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('name of the channel')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('the channel type to be set')
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('category')
            .setDescription('the category the channel should be under')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName('permission-role')
            .setDescription('the role necessary to access the channel')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('🚨 delete a channel')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('channel to be deleted')
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  autocomplete: async (interaction: AutocompleteInteraction) => {
    const { options } = interaction;
    const focusedOption = options.getFocused(true);
    let choices;

    if (focusedOption.name === 'type') {
      choices = ['text', 'voice'];
    }

    const filtered = (choices as string[]).filter((c) =>
      c.startsWith(focusedOption.value)
    );

    await interaction.respond(filtered.map((c) => ({ name: c, value: c })));
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.options.getSubcommand() === 'create') {
      if (interaction.inCachedGuild()) {
        const { options, guild } = interaction;

        const {
          ViewChannel,
          ReadMessageHistory,
          SendMessages,
          Connect,
          Speak
        } = PermissionFlagsBits;

        const name = options.getString('name') as string;
        const type = options.getString('type');
        const category = options.getChannel(
          'category'
        ) as CategoryChannelResolvable;
        const role = options.getRole('permission-role') as Role;

        if (type === 'text') {
          try {
            await guild.channels
              .create({
                name: name,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                  {
                    id: role,
                    allow: [ViewChannel, SendMessages, ReadMessageHistory]
                  },
                  {
                    id: guild.roles.everyone,
                    deny: [ViewChannel, SendMessages, ReadMessageHistory]
                  }
                ]
              })
              .then((channel) => {
                return interaction.reply({
                  embeds: [
                    new SuccessEmbed(
                      `***channel ${channel} successfully created.***`
                    )
                  ]
                });
              });
          } catch (e) {
            logger.error(e);
            return interaction.reply({
              embeds: [
                new ErrorEmbed(
                  `***Error while creating channel*** \`${name}\` ***`
                )
              ],
              ephemeral: true
            });
          }
        } else if (type === 'voice') {
          try {
            await guild.channels
              .create({
                name: name,
                type: ChannelType.GuildVoice,
                parent: category,
                permissionOverwrites: [
                  {
                    id: role,
                    allow: [ViewChannel, Connect, Speak]
                  },
                  {
                    id: guild.roles.everyone,
                    deny: [ViewChannel, Connect, Speak]
                  }
                ]
              })
              .then((channel) => {
                return interaction.reply({
                  embeds: [
                    new SuccessEmbed(
                      `***channel ${channel} successfully created.***`
                    )
                  ]
                });
              });
          } catch (e) {
            logger.error(e);
            return interaction.reply({
              embeds: [
                new ErrorEmbed(
                  `***Error while creating channel*** \`${name}\` ***`
                )
              ],
              ephemeral: true
            });
          }
        }
      }
    } else if (interaction.options.getSubcommand() === 'delete') {
      const { options } = interaction;

      const channel = options.getChannel('channel');

      if (
        channel?.type === ChannelType.GuildText ||
        ChannelType.GuildAnnouncement
      ) {
        (channel as GuildTextBasedChannel).delete().then((channel) => {
          return interaction.reply({
            embeds: [
              new SuccessEmbed(
                `***channel*** \`${channel.name}\` ***successfully deleted.***`
              )
            ]
          });
        });
      } else if (channel?.type === ChannelType.GuildVoice) {
        (channel as BaseGuildVoiceChannel).delete().then((channel) => {
          return interaction.reply({
            embeds: [
              new SuccessEmbed(
                `***channel*** \`${channel.name}\` ***successfully deleted.***`
              )
            ]
          });
        });
      } else if (channel?.type === ChannelType.GuildForum) {
        (channel as ForumChannel).delete().then((channel) => {
          return interaction.reply({
            embeds: [
              new SuccessEmbed(
                `***channel*** \`${channel.name}\` ***successfully deleted.***`
              )
            ]
          });
        });
      } else if (channel?.type === ChannelType.GuildStageVoice) {
        (channel as StageChannel).delete().then((channel) => {
          return interaction.reply({
            embeds: [
              new SuccessEmbed(
                `***channel*** \`${channel.name}\` ***successfully deleted.***`
              )
            ]
          });
        });
      } else if (channel?.type === ChannelType.GuildCategory) {
        (channel as CategoryChannel).delete().then((channel) => {
          return interaction.reply({
            embeds: [
              new SuccessEmbed(
                `***channel category*** \`${channel.name}\` ***successfully deleted.***`
              )
            ]
          });
        });
      }
    }
  }
} satisfies Command;
