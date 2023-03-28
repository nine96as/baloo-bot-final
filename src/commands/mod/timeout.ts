import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed } from '#interfaces';
import { logger } from '#utils';

export const command: Command = {
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

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { options, user, guild } = interaction;

      const member = options.getMember('target');
      const duration = options.getNumber('duration');
      const reason = options.getString('reason') || 'no reason given';

      if (!member)
        return interaction.reply({
          embeds: [new ErrorEmbed('***invalidMember***')],
          ephemeral: true
        });

      if (member.user.equals(user))
        return interaction.reply({
          embeds: [new ErrorEmbed('***cantKickSelf***')],
          ephemeral: true
        });

      if (!member.moderatable)
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
        await member.timeout(duration, reason).then(() => {
          return interaction.reply({
            embeds: [new SuccessEmbed(`***${member.user.tag} was timed out***`)]
          });
        });
      } catch (e) {
        logger.error(e);
        return interaction.reply({
          embeds: [new ErrorEmbed('***timeoutError***')],
          ephemeral: true
        });
      }
    }
  }
};
