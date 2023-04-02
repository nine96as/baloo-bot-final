import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed, WarnEmbed } from '#interfaces';
import { logger } from '#utils';
import ms from 'ms';

export const command = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('🚨 timeout a member')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('user to timeout')
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName('duration')
        .setDescription('duration of timeout')
        .addChoices(
          { name: '60 seconds', value: 60 * 1000 },
          { name: '5 minutes', value: 5 * 60 * 1000 },
          { name: '10 minutes', value: 10 * 60 * 1000 },
          { name: '30 minutes', value: 30 * 60 * 1000 },
          { name: '1 hour', value: 60 * 60 * 1000 },
          { name: '1 day', value: 24 * 60 * 60 * 1000 },
          { name: '1 week', value: 7 * 24 * 60 * 60 * 1000 }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('reason for punishment')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.inCachedGuild()) {
      const { options, user, guild } = interaction;

      const member = options.getMember('target');
      const duration = options.getNumber('duration') as number;
      const reason = options.getString('reason') || 'no reason given';

      if (!member)
        return interaction.reply({
          embeds: [new WarnEmbed('***Invalid member provided.***')],
          ephemeral: true
        });

      if (member.user.equals(user))
        return interaction.reply({
          embeds: [new WarnEmbed('***You cannot timeout yourself.***')],
          ephemeral: true
        });

      if (!member.moderatable)
        return interaction.reply({
          embeds: [
            new WarnEmbed(`***${member} is not moderatable by the bot.
            Please ensure that the bot's role is above all member roles.
            ***`)
          ],
          ephemeral: true
        });

      if (
        member.roles.highest.position >=
          interaction.member.roles.highest.position &&
        user.id !== guild.ownerId
      )
        return interaction.reply({
          embeds: [
            new WarnEmbed(
              `***You cannot timeout ${member} as they are higher than you.***`
            )
          ],
          ephemeral: true
        });

      try {
        await member.timeout(duration, reason).then(() => {
          return interaction.reply({
            embeds: [
              new SuccessEmbed(
                `***${member} was timed out for \`${ms(duration, {
                  long: true
                })}\`***`
              )
            ]
          });
        });
      } catch (e) {
        logger.error(e);
        return interaction.reply({
          embeds: [new ErrorEmbed(`***Error while timing out ${member}***`)],
          ephemeral: true
        });
      }
    }
  }
} satisfies Command;
