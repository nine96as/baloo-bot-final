import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  BaseGuildTextChannel
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed } from '#interfaces';
import { prisma } from '#utils';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('🚨 unlock a previously locked channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { guild, guildId } = interaction;
      const channel = interaction.channel as BaseGuildTextChannel;

      if (
        channel.permissionsFor(guildId)?.has(PermissionFlagsBits.SendMessages)
      ) {
        return interaction.reply({
          embeds: [new ErrorEmbed(`***channelNotLocked***`)],
          ephemeral: true
        });
      }

      channel.permissionOverwrites.edit(interaction.guildId, {
        SendMessages: null
      });

      prisma.lockdownSystem.delete({
        where: { guildId: guild.id, channelId: channel.id }
      });

      return interaction.reply({
        embeds: [new SuccessEmbed(`***<#${channel.id}> was unlocked***`)]
      });
    }
  }
};
