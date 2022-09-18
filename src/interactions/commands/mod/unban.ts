import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command } from '../../../structures/command';
import { ErrorEmbed, SuccessEmbed } from '../../../structures/embed';
import logger from '../../../utils/functions/logger';

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

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { options, guild } = interaction;

      const id = options.getString('target')!;
      const reason = options.getString('reason') || 'no reason given';

      if (!/\d{18,19}/.test(id)) {
        return interaction.reply({
          embeds: [new ErrorEmbed('***invalidId***')],
          ephemeral: true
        });
      }

      await guild.bans.fetch();
      if (!guild.bans.cache.some((ban) => ban.user.id === id)) {
        return await interaction.reply({
          embeds: [new ErrorEmbed('***notBanned***')],
          ephemeral: true
        });
      }

      try {
        guild.bans.remove(id!, reason);
        return interaction.reply({
          embeds: [new SuccessEmbed(`***${id} was unbanned***`)]
        });
      } catch (e) {
        if (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [new ErrorEmbed('***unbanError***')],
            ephemeral: true
          });
        }
      }
    }
  }
};
