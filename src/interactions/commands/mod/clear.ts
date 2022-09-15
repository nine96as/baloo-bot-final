import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Message
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import { SuccessEmbed, ErrorEmbed } from '../../../structures/embed';
import logger from '../../../utils/functions/logger';
import wait from 'node:timers/promises';

class Clear extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
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
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .toJSON()
    );
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const { options, channel } = interaction;
      
      const amount = options.getNumber('amount')!;
      const target = options.getMember('target');
      const messages = await channel?.messages.fetch();

      if (target) {
        let i = 0;
        const filtered: Message<boolean>[] = [];
        messages!.forEach((m: Message) => {
          if (m.author.id === target.id && amount > i) {
            filtered.push(m);
            i++;
          }
        });

        try {
          await channel?.bulkDelete(filtered, true).then((messages) => {
            interaction.reply({
              embeds: [new SuccessEmbed(`***cleared ${messages.size} message(s) from ${target}***`)]
            });
          });
        } catch (e) {
          logger.error(e);
          interaction.reply({
            embeds: [new ErrorEmbed('messageDeleteError')],
            ephemeral: true
          })
        }
      } else {
        try {
          await channel?.bulkDelete(amount, true);
          interaction.reply({
            embeds: [new SuccessEmbed(`***cleared ${amount} message(s) from channel***`)]
          });
        } catch (e) {
          logger.error(e);
          interaction.reply({
            embeds: [new ErrorEmbed('messageDeleteError')],
            ephemeral: true
          })
        }
      }
      await wait.setTimeout(10000);
      await interaction.deleteReply();
    }
  }
}

export default new Clear();
