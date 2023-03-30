import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  BaseGuildTextChannel,
  ChannelType
} from 'discord.js';
import ms from 'ms';
import { Command, SuccessEmbed, ErrorEmbed } from '#interfaces';
import { prisma } from '#utils';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('🚨 prevent users from talking in a channel')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('target channel')
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName('duration')
        .setDescription('duration of lockdown (1m, 1h, 1d)')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { options, guild, guildId } = interaction;
      const duration = options.getString('duration');
      const channel =
        (options.getChannel('channel') as BaseGuildTextChannel) ??
        (interaction.channel as BaseGuildTextChannel);

      if (
        !channel.permissionsFor(guildId)?.has(PermissionFlagsBits.SendMessages)
      ) {
        return interaction.reply({
          embeds: [new ErrorEmbed(`***channelAlreadyLocked***`)],
          ephemeral: true
        });
      }

      channel.permissionOverwrites.edit(interaction.guildId, {
        SendMessages: false
      });

      interaction.reply({
        embeds: [new SuccessEmbed(`***<#${channel.id}> was locked***`)]
      });

      if (duration) {
        const end = Date.now() + ms(duration);
        prisma.lockdownSystem.create({
          data: {
            guildId: guild.id,
            channelId: channel.id,
            duration: end
          }
        });

        setTimeout(async () => {
          channel.permissionOverwrites
            .edit(guildId, {
              SendMessages: null
            })
            .then(async () => {
              return prisma.lockdownSystem.delete({
                where: { guildId: guild.id, channelId: channel.id }
              });
            });
        }, ms(duration));
      }
    }
  }
};
