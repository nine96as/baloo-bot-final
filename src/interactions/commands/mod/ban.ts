import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import logger from '../../../utils/functions/logger';
import { ErrorEmbed, SuccessEmbed } from '../../../structures/embed';

class Ban extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('ban')
        .setDescription('🚨 ban a member')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('user to ban')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('reason').setDescription('reason for punishment')
        )
        .addIntegerOption((option) =>
          option
            .setName('clean-days')
            .setDescription('number of days to delete msgs for (0-7)')
            .setMinValue(0)
            .setMaxValue(7)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .toJSON()
    );
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const { options, user, guild } = interaction;
      
      const member = options.getMember('target');
      const reason = options.getString('reason') || 'no reason given';
      const cleanDays = Number(options.getInteger('clean-days'));

      if (!member) return interaction.reply({
        embeds: [new ErrorEmbed('***invalidMember***')],
        ephemeral: true
      })
      
      if (member.user.equals(user)) return interaction.reply({
        embeds: [new ErrorEmbed('***cantBanSelf***')],
        ephemeral: true
      })

      if (!member.bannable) return interaction.reply({ 
        embeds: [new ErrorEmbed('***missingPermissions***')],
        ephemeral: true
      })

      if (interaction.member.roles.highest.position <= member?.roles.highest.position &&
        user.id !== guild.ownerId) return interaction.reply({
          embeds: [new ErrorEmbed('***superiorMember***')],
          ephemeral: true
      })

      try {
        await member.ban({
          reason: reason,
          deleteMessageDays: cleanDays
        });
        return await interaction.reply({ 
          embeds: [new SuccessEmbed(`***${member.user.tag} was banned***`)] 
        });
      } catch (e) {
        if (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [new ErrorEmbed(`***banError***`)],
            ephemeral: true 
          });
        }
      }
    }
  }
}

export default new Ban();
