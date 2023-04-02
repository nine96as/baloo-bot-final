import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  TextChannel
} from 'discord.js';
import ms from 'ms';
import { Command, SuccessEmbed, ErrorEmbed, WarnEmbed } from '#interfaces';
import { logger } from '#utils';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('🚨 configures slowmode for a channel')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('🚨 sets slowmode for the given channel')
        .addStringOption((option) =>
          option
            .setName('duration')
            .setDescription('message cooldown duration (e.g. 60s, 1h, 2m)')
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('target channel')
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('🚨 removes slowmode for the given channel')
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('target channel')
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.options.getSubcommand() === 'set') {
      if (interaction.inCachedGuild()) {
        const { options } = interaction;
        const channel =
          (options.getChannel('channel') as TextChannel) ??
          (interaction.channel as TextChannel);
        const duration = options.getString('duration') as string;
        const durationMS = ms(duration);

        if (durationMS > 21600000) {
          return interaction.reply({
            embeds: [
              new WarnEmbed('***The provided duration was too high.***')
            ],
            ephemeral: true
          });
        }

        try {
          await channel.setRateLimitPerUser(durationMS / 1000).then(() => {
            return interaction.reply({
              embeds: [
                new SuccessEmbed(
                  `***slowmode set in ${channel} to \`${ms(durationMS, {
                    long: true
                  })}\`***`
                )
              ]
            });
          });
        } catch (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [
              new ErrorEmbed(`***Error while setting slowmode in ${channel}***`)
            ],
            ephemeral: true
          });
        }
      }
    } else if (interaction.options.getSubcommand() === 'remove') {
      if (interaction.inCachedGuild()) {
        const { options } = interaction;
        const channel =
          (options.getChannel('channel') as TextChannel) ??
          (interaction.channel as TextChannel);
        const duration = '0' as string;
        const durationMS = ms(duration);

        await channel.setRateLimitPerUser(durationMS / 1000).then(() => {
          return interaction.reply({
            embeds: [new SuccessEmbed(`***slowmode removed in ${channel}***`)]
          });
        });
      }
    }
  }
};
