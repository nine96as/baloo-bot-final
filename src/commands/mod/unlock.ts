import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  TextChannel,
  ChannelType
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed, WarnEmbed } from '#interfaces';
import { logger, prisma } from '#utils';

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
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.inCachedGuild()) {
      const { guildId } = interaction;
      const channel = interaction.channel as TextChannel;

      if (
        channel.permissionsFor(guildId)?.has(PermissionFlagsBits.SendMessages)
      ) {
        return interaction.reply({
          embeds: [new WarnEmbed(`***${channel} is not locked.***`)],
          ephemeral: true
        });
      }

      try {
        await channel.permissionOverwrites.edit(guildId, {
          SendMessages: null
        });
      } catch (e) {
        logger.error(e);
        return interaction.reply({
          embeds: [new ErrorEmbed(`***Error while unlocking ${channel}***`)],
          ephemeral: true
        });
      }

      await prisma.lockdownSystem.delete({ where: { channelId: channel.id } });

      return interaction.reply({
        embeds: [new SuccessEmbed(`***${channel} was unlocked.***`)]
      });
    }
  }
};
