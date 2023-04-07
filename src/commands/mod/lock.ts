import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  TextChannel
} from 'discord.js';
import ms from 'ms';
import { Command, ErrorEmbed, SuccessEmbed, WarnEmbed } from '#interfaces';
import { logger, prisma } from '#utils';

export const command = {
  folder: 'moderation',
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
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.inCachedGuild()) {
      const { options, guildId } = interaction;
      const duration = options.getString('duration');
      const channel =
        (options.getChannel('channel') as TextChannel) ??
        (interaction.channel as TextChannel);

      if (
        !channel.permissionsFor(guildId)?.has(PermissionFlagsBits.SendMessages)
      ) {
        return interaction.reply({
          embeds: [new WarnEmbed(`***${channel} is already locked.***`)],
          ephemeral: true
        });
      }

      try {
        await channel.permissionOverwrites.edit(guildId, {
          SendMessages: false
        });
      } catch (e) {
        logger.error(e);
        return interaction.reply({
          embeds: [new ErrorEmbed(`***Error while locking ${channel}***`)],
          ephemeral: true
        });
      }

      await prisma.channel.upsert({
        where: { channelId: channel.id },
        create: { channelId: channel.id, guildId: interaction.guildId },
        update: { channelId: channel.id }
      });

      await prisma.lockdownSystem.upsert({
        where: { channelId: channel.id },
        create: { guildId: guildId, channelId: channel.id },
        update: { guildId: guildId, channelId: channel.id }
      });

      interaction.reply({
        embeds: [new SuccessEmbed(`***${channel} was locked.***`)]
      });

      if (duration) {
        const end = Date.now() + ms(duration);
        await prisma.lockdownSystem.upsert({
          where: { channelId: channel.id },
          create: {
            guildId: guildId,
            channelId: channel.id,
            duration: end
          },
          update: {
            guildId: guildId,
            channelId: channel.id,
            duration: end
          }
        });

        setTimeout(async () => {
          channel.permissionOverwrites.edit(guildId, {
            SendMessages: null
          });

          await prisma.lockdownSystem.delete({
            where: { channelId: channel.id }
          });

          return interaction.reply({
            embeds: [new SuccessEmbed(`***${channel} was unlocked.***`)]
          });
        }, ms(duration));
      }
    }
  }
} satisfies Command;
