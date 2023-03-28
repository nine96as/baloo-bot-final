import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Message,
  Collection
} from 'discord.js';
import { Command, SuccessEmbed, ErrorEmbed } from '#structures';
import { logger } from 'utils';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription(
      '🚨 clears a specific amount of messages from a channel or target'
    )
    .addNumberOption((option) =>
      option
        .setName('amount')
        .setDescription('amount of messages to clear')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName('target').setDescription('user to clear messages from')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { options, channel } = interaction;

      const amount = options.getNumber('amount') as number;
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
          await channel?.bulkDelete(filtered, true).then((messages) => {
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
            embeds: [new ErrorEmbed('***messageDeleteError***')],
            ephemeral: true
          });
        }
      } else {
        try {
          await channel?.bulkDelete(amount, true).then(() => {
            return interaction.reply({
              embeds: [
                new SuccessEmbed(`***cleared \`${amount}\` message(s)***`)
              ]
            });
          });
        } catch (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [new ErrorEmbed('***messageDeleteError***')],
            ephemeral: true
          });
        }
      }
      setTimeout(async () => interaction.deleteReply(), 5000);
    }
  }
};
