import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed } from '#structures';
import { logger } from '#functions';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🚨 ban a member')
    .addUserOption((option) =>
      option.setName('target').setDescription('user to ban').setRequired(true)
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
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { options, user, guild } = interaction;

      const member = options.getMember('target');
      const reason = options.getString('reason') || 'no reason given';
      const cleanDays = Number(options.getInteger('clean-days'));

      if (!member)
        return interaction.reply({
          embeds: [new ErrorEmbed('***invalidMember***')],
          ephemeral: true
        });

      if (member.user.equals(user))
        return interaction.reply({
          embeds: [new ErrorEmbed('***cantBanSelf***')],
          ephemeral: true
        });

      if (!member.bannable)
        return interaction.reply({
          embeds: [new ErrorEmbed('***missingPermissions***')],
          ephemeral: true
        });

      if (
        interaction.member.roles.highest.position <=
          member?.roles.highest.position &&
        user.id !== guild.ownerId
      )
        return interaction.reply({
          embeds: [new ErrorEmbed('***superiorMember***')],
          ephemeral: true
        });

      try {
        await member
          .ban({
            reason: reason,
            deleteMessageDays: cleanDays
          })
          .then(() => {
            return interaction.reply({
              embeds: [new SuccessEmbed(`***${member.user.tag} was banned***`)]
            });
          });
      } catch (e) {
        logger.error(e);
        return interaction.reply({
          embeds: [new ErrorEmbed(`***banError***`)],
          ephemeral: true
        });
      }
    }
  }
};
