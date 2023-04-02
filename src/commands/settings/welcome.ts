import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChannelType,
  PermissionFlagsBits,
  TextBasedChannel
} from 'discord.js';
import { Command, SuccessEmbed } from '#interfaces';
import { prisma } from '#utils';

export const command = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('⚙️ welcome system setup')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('⚙️ set the welcome channel for the guild')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('target channel')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.options.getSubcommand() === 'set') {
      if (interaction.inCachedGuild()) {
        const { options } = interaction;

        const channel = options.getChannel('channel') as TextBasedChannel;

        await prisma.channel.upsert({
          where: { channelId: channel.id },
          create: { channelId: channel.id, guildId: interaction.guildId },
          update: { channelId: channel.id }
        });

        await prisma.welcomeSystem.upsert({
          where: { channelId: channel.id },
          create: { guildId: interaction.guildId, channelId: channel.id },
          update: { guildId: interaction.guildId, channelId: channel.id }
        });

        return interaction.reply({
          embeds: [
            new SuccessEmbed(`***welcome channel set as <#${channel.id}>***`)
          ]
        });
      }
    }
  }
} satisfies Command;
