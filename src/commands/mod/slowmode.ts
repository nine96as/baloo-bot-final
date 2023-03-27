import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed } from '#structures';
import ms from 'ms';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('🚨 set slowmode duration for a channel')
    .addStringOption((option) =>
      option
        .setName('duration')
        .setDescription('message cooldown duration (e.g. 60s, 1h, 2m)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { channel, options } = interaction;

      const duration = options.getString('duration') as string;
      const durationMS = ms(duration);

      if (durationMS > 21600000) {
        return interaction.reply({
          embeds: [new ErrorEmbed('***invalidDuration***')],
          ephemeral: true
        });
      }

      await channel?.setRateLimitPerUser(durationMS / 1000).then(() => {
        return interaction.reply({
          embeds: [new SuccessEmbed(`***slowmode set to \`${duration}\`***`)]
        });
      });
    }
  }
};
