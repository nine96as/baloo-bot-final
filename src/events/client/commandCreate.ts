import {
  Interaction,
  CommandInteraction,
  Events,
  AutocompleteInteraction
} from 'discord.js';
import { Bot } from '#structures';
import { Event, ErrorEmbed } from '#interfaces';
import { logger } from '#utils';

export const event: Event = {
  name: Events.InteractionCreate,
  async execute(client: Bot, interaction: Interaction) {
    if (
      interaction.isChatInputCommand() ||
      interaction.isContextMenuCommand()
    ) {
      // Checks if command exists in commands collection.
      const command = client.commands.get(interaction.commandName);

      // Exits early if command doesn't exist.
      if (!command) return;

      // Exits early if command wasn't called in recognised guild.
      if (!interaction.inCachedGuild()) return;

      // If command exists, tries to carry out "execute" function.
      try {
        await command.execute(interaction as CommandInteraction, client);
      } catch (e) {
        logger.error(e);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            embeds: [new ErrorEmbed('***commandExecuteError***')],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [new ErrorEmbed('***commandExecuteError***')],
            ephemeral: true
          });
        }
      }
    } else if (interaction.isAutocomplete()) {
      // Checks if command exists in commands collection.
      const command = client.commands.get(interaction.commandName);

      // Exits early if command doesn't exist or doesn't contain `autocomplete` function.
      if (!command || !command.autocomplete) return;

      // Exits early if command wasn't called in recognised guild.
      if (!interaction.inCachedGuild()) return;

      // If command exists, tries to carry out "autocomplete" function.
      try {
        await command.autocomplete(
          interaction as AutocompleteInteraction,
          client
        );
      } catch (e) {
        logger.error(e);
      }
    }
  }
};
