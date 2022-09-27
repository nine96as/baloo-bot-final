import { Interaction, CommandInteraction } from 'discord.js';
import { Bot, Event, ErrorEmbed } from '#structures';
import { logger } from '#functions';

export const event: Event = {
  name: 'interactionCreate',
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      // checks if command exists in commands collection
      const command = client.commands.get(interaction.commandName);

      // exits early if command doesn't exist
      if (!command) return;

      // if command exists, tries to carry out "execute" function
      try {
        await command.execute(interaction as CommandInteraction, client);
      } catch (e) {
        logger.error(e);
        interaction.reply({
          embeds: [new ErrorEmbed('***commandExecuteError***')],
          ephemeral: true
        });
      }
    }
    if (interaction.isContextMenuCommand()) {
      // checks if command exists in commands collection
      const command = client.commands.get(interaction.commandName);

      // exits early if command doesn't exist
      if (!command) return;

      // if command exists, tries to carry out "execute" function
      try {
        await command.execute(interaction as CommandInteraction, client);
      } catch (e) {
        logger.error(e);
        interaction.reply({
          embeds: [new ErrorEmbed('***contextMenuExecuteError***')],
          ephemeral: true
        });
      }
    }
  }
};
