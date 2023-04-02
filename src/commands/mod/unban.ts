import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed, WarnEmbed } from '#interfaces';
import { logger } from '#utils';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('🚨 unban a member')
    .addStringOption((option) =>
      option
        .setName('target')
        .setDescription('user id to unban')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('reason for punishment')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.inCachedGuild()) {
      const { options, guild } = interaction;

      const id = options.getString('target') as string;
      const reason = options.getString('reason') || 'no reason given';

      if (!/\d{18,19}/.test(id)) {
        return interaction.reply({
          embeds: [new WarnEmbed('***Invalid userId provided.***')],
          ephemeral: true
        });
      }

      await guild.bans.fetch();
      const ban = guild.bans.cache.find((ban) => ban.user.id === id);
      if (!ban) {
        return interaction.reply({
          embeds: [new WarnEmbed(`***Target user is not banned.***`)],
          ephemeral: true
        });
      }

      try {
        guild.bans.remove(id, reason);
        return interaction.reply({
          embeds: [new SuccessEmbed(`***${ban.user} was unbanned.***`)]
        });
      } catch (e) {
        logger.error(e);
        return interaction.reply({
          embeds: [new ErrorEmbed(`***Error while unbanning ${ban.user}***`)],
          ephemeral: true
        });
      }
    }
  }
};
