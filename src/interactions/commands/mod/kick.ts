import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import { ErrorEmbed, SuccessEmbed } from '../../../structures/embed';
import logger from '../../../utils/functions/logger';

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
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .toJSON()
    );
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const { options, user, guild } = interaction;
      
      const member = options.getMember('target');
      const reason = options.getString('reason') || 'no reason given';

      if (!member) return interaction.reply({
        embeds: [new ErrorEmbed('***invalidMember***')],
        ephemeral: true
      })

      if (member.user.equals(user)) return interaction.reply({
        embeds: [new ErrorEmbed('***cantKickSelf***')],
        ephemeral: true
      })

      if (!member.kickable) return interaction.reply({ 
        embeds: [new ErrorEmbed('***missingPermissions***')],
        ephemeral: true
      })

      if (interaction.member.roles.highest.position <= member?.roles.highest.position &&
        user.id !== guild.ownerId) return interaction.reply({
          embeds: [new ErrorEmbed('***superiorMember***')],
          ephemeral: true
      })

      try {
        await member.kick(reason);
        return await interaction.reply({ 
          embeds: [new SuccessEmbed(`***${member.user.tag} was kicked***`)] 
        });
      } catch (e) {
        if (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [new ErrorEmbed(`***kickError***`)],
            ephemeral: true 
          });
        }
      }
    }
  }
}

export default new Kick();
