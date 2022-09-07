import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Message,
  TextChannel
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
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
      const amount = interaction.options.getNumber('amount')!;
      const channel = interaction.channel;
      const target = interaction.options.getMember('target');
      const messages = await channel?.messages.fetch();

      if (amount! > 100) {
        interaction.reply(
          '❌ | you cannot clear more than 100 messages at once.'
        );
      } else {
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
              interaction.reply(
                `🚨 | cleared ${messages.size} message(s) from ${target}.`
              );
            });
          } catch (e) {
            logger.error(e);
            interaction.reply(
              '❌ | there was an error while attempting to delete the messages.'
            );
          }
        } else {
          try {
            await channel?.bulkDelete(amount!, true);
            interaction.reply(
              `🚨 | cleared ${amount} message(s) from this channel.`
            );
          } catch (e) {
            logger.error(e);
            interaction.reply(
              '❌ | there was an error while attempting to delete the messages.'
            );
          }
        }
      }
      await wait.setTimeout(10000);
      await interaction.deleteReply();
    }
  }
}

export default new Clear();
