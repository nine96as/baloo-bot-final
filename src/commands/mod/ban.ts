import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed, WarnEmbed } from '#interfaces';
import { logger } from '#utils';

export const command = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🚨 ban a member')
    .addUserOption((option) =>
      option.setName('target').setDescription('user to ban').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('reason for punishment')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.inCachedGuild()) {
      const { options, user, guild } = interaction;
      const member = options.getMember('target');
      const reason = options.getString('reason') || 'no reason given';

      if (!member)
        return interaction.reply({
          embeds: [new WarnEmbed('***Invalid member provided.***')],
          ephemeral: true
        });

      if (member.user.equals(user))
        return interaction.reply({
          embeds: [new WarnEmbed('***You cannot ban yourself.***')],
          ephemeral: true
        });

      if (!member.bannable)
        return interaction.reply({
          embeds: [
            new WarnEmbed(`***${member} is not bannable by the bot.
            Please ensure that the bot's role is above all member roles.
            ***`)
          ],
          ephemeral: true
        });

      if (
        interaction.member.roles.highest.position <=
          member.roles.highest.position &&
        user.id !== guild.ownerId
      )
        return interaction.reply({
          embeds: [
            new WarnEmbed(
              `***You cannot ban ${member} as they are higher than you.***`
            )
          ],
          ephemeral: true
        });

      try {
        await member.ban({ reason: reason }).then(() => {
          return interaction.reply({
            embeds: [new SuccessEmbed(`***${member} was banned.***`)]
          });
        });
      } catch (e) {
        logger.error(e);
        return interaction.reply({
          embeds: [new ErrorEmbed(`***Error while banning ${member}***`)],
          ephemeral: true
        });
      }
    }
  }
} satisfies Command;
