import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  TextChannel,
  ChannelType
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed } from '#interfaces';
import { prisma } from '#utils';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('🚨 unlock a previously locked channel')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('target channel')
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { guildId } = interaction;
      const channel = interaction.channel as TextChannel;

      if (
        channel.permissionsFor(guildId)?.has(PermissionFlagsBits.SendMessages)
      ) {
        return interaction.reply({
          embeds: [new ErrorEmbed(`***channelNotLocked***`)],
          ephemeral: true
        });
      }

      await channel.permissionOverwrites.edit(guildId, {
        SendMessages: null
      });

      await prisma.lockdownSystem.delete({ where: { channelId: channel.id } });

      return interaction.reply({
        embeds: [new SuccessEmbed(`***<#${channel.id}> was unlocked***`)]
      });
    }
  }
};
