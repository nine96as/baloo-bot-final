import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import logger from '../../../utils/functions/logger';
import wait from 'node:timers/promises';

class Kick extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('kick')
        .setDescription('🚨 kick a member')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('user to kick')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('reason').setDescription('reason for punishment')
        )
        .setDefaultMemberPermissions(
          PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
        )
        .toJSON()
    );
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const member = interaction.options.getMember('target');
      const reason =
        interaction.options.getString('reason') || 'no reason given';

      if (!member) return interaction.reply('invalid member');

      try {
        await interaction.guild.members.kick(member, reason);
        const embed = new EmbedBuilder()
          .setTitle(`🚨 | ${member.user.tag} has been kicked.`)
          .setColor('Random')
          .setDescription(`**reason**: ${reason}`)
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      } catch (e) {
        if (e) {
          logger.error(e);
          return interaction.reply(`❌ | failed to kick ${member.user.tag}`);
        }
      }
      await wait.setTimeout(10000);
      await interaction.deleteReply();
    }
  }
}

export default new Kick();
