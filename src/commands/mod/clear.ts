import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Message,
  Collection,
  ChannelType,
  TextChannel
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed } from '#interfaces';
import { logger } from '#utils';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription(
      '🚨 deletes a specific amount of messages from a channel or target'
    )
    .addNumberOption((option) =>
      option
        .setName('amount')
        .setDescription('amount of messages to clear')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('target channel')
        .addChannelTypes(ChannelType.GuildText)
    )
    .addUserOption((option) =>
      option.setName('target').setDescription('user to clear messages from')
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageChannels
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.inCachedGuild()) {
      const { options } = interaction;
      const amount = options.getNumber('amount') as number;
      const channel =
        (options.getChannel('channel') as TextChannel) ??
        (interaction.channel as TextChannel);
      const target = options.getMember('target');
      const messages = (await channel?.messages.fetch()) as Collection<
        string,
        Message<boolean>
      >;

      if (target) {
        let i = 0;
        const filtered: Message<boolean>[] = [];
        messages.forEach((m: Message) => {
          if (m.author.id === target.id && amount > i) {
            filtered.push(m);
            i++;
          }
        });

        try {
          await channel.bulkDelete(filtered, true).then((messages) => {
            return interaction.reply({
              embeds: [
                new SuccessEmbed(
                  `***cleared \`${messages.size}\` message(s) from ${target}***`
                )
              ]
            });
          });
        } catch (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [
              new ErrorEmbed(
                `***Error while deleting messages from ${target}***`
              )
            ],
            ephemeral: true
          });
        }
      } else {
        try {
          await channel.bulkDelete(amount, true).then(() => {
            return interaction.reply({
              embeds: [
                new SuccessEmbed(
                  `***cleared \`${amount}\` message(s) from ${channel}***`
                )
              ]
            });
          });
        } catch (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [
              new ErrorEmbed(
                `***Error while deleting messages from ${channel}***`
              )
            ],
            ephemeral: true
          });
        }
      }
      setTimeout(async () => interaction.deleteReply(), 5000);
    }
  }
};
