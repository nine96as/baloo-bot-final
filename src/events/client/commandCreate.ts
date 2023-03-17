import { Interaction, CommandInteraction, Events } from 'discord.js';
import { Bot, Event, ErrorEmbed } from '#structures';
import { logger } from '#functions';

export const event: Event = {
  name: Events.InteractionCreate,
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      // Checks if command exists in commands collection.
      const command = client.commands.get(interaction.commandName);

      // Exits early if command doesn't exist.
      if (!command) return;

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
    }
    if (interaction.isContextMenuCommand()) {
      // Checks if command exists in commands collection.
      const command = client.commands.get(interaction.commandName);

      // Exits early if command doesn't exist.
      if (!command) return;

      // If command exists, tries to carry out "execute" function.
      try {
        await command.execute(interaction as CommandInteraction, client);
      } catch (e) {
        logger.error(e);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            embeds: [new ErrorEmbed('***contextMenuExecuteError***')],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [new ErrorEmbed('***contextMenuExecuteError***')],
            ephemeral: true
          });
        }
      }
    }
  }
};
