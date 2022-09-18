import { Interaction, CommandInteraction } from 'discord.js';
import { Bot } from '../../structures/bot';
import { Event } from '../../structures/event';
import { ErrorEmbed } from '../../structures/embed';
import logger from '../../utils/functions/logger';

export const event: Event = {
  name: 'interactionCreate',
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      // checks if command exists in commands collection
      const command = client.commands.get(interaction.commandName);

      // exits early if command doesn't exist
      if (!command) return;

      // music and activity commands need to be deferred
      if (
        interaction.commandName === 'music' ||
        interaction.commandName === 'activities'
      ) {
        // if command exists, tries to carry out "execute" function
        try {
          await interaction.deferReply();
          await command.execute(interaction as CommandInteraction, client);
        } catch (e) {
          logger.error(e);
          await interaction.followUp({
            embeds: [new ErrorEmbed('***commandExecuteError***')],
            ephemeral: true
          });
        }
      } else {
        // if command exists, tries to carry out "execute" function
        try {
          await command.execute(interaction as CommandInteraction, client);
        } catch (e) {
          logger.error(e);
          await interaction.followUp({
            embeds: [new ErrorEmbed('***commandExecuteError***')],
            ephemeral: true
          });
        }
      }
    }
    if (interaction.isContextMenuCommand()) {
      // checks if command exists in commands collection
      const command = client.commands.get(interaction.commandName);

      // exits early if command doesn't exist
      if (!command) return;

      // translate command needs to be deferred
      if (interaction.commandName === 'translate') {
        // if command exists, tries to carry out "execute" function
        try {
          await interaction.deferReply();
          await command.execute(interaction as CommandInteraction, client);
        } catch (e) {
          logger.error(e);
          await interaction.followUp({
            embeds: [new ErrorEmbed('***contextExecuteError***')],
            ephemeral: true
          });
        }
      } else {
        // if command exists, tries to carry out "execute" function
        try {
          await command.execute(interaction as CommandInteraction, client);
        } catch (e) {
          logger.error(e);
          await interaction.followUp({
            embeds: [new ErrorEmbed('***contextExecuteError***')],
            ephemeral: true
          });
        }
      }
    }
  }
}
