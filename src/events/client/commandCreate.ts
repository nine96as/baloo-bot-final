import { Events, Interaction, CommandInteraction } from 'discord.js';
import logger from '../../utils/functions/logger';
import Bot from '../../structures/bot';
import Event from '../../structures/event';

export default class CommandCreate implements Event {
  client: Bot;
  name = Events.InteractionCreate;

  constructor(client: Bot) {
    this.client = client;
  }

  execute = async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      // checks if command exists in commands collection
      const command = this.client.commands.get(interaction.commandName);

      // exits early if command doesn't exist
      if (!command) return;

      // music command needs to be deferred
      if (interaction.commandName === 'music') {
        // if command exists, tries to carry out "execute" function
        try {
          await interaction.deferReply();
          await command.execute(interaction as CommandInteraction, this.client);
        } catch (e) {
          logger.error(e);
          await interaction.followUp({
            content: '❌ | error executing this command',
            ephemeral: true
          });
        }
      } else {
        // if command exists, tries to carry out "execute" function
        try {
          await command.execute(interaction as CommandInteraction, this.client);
        } catch (e) {
          logger.error(e);
          await interaction.followUp({
            content: '❌ | error executing this command',
            ephemeral: true
          });
        }
      }
    }
    if (interaction.isContextMenuCommand()) {
      // checks if command exists in commands collection
      const command = this.client.commands.get(interaction.commandName);

      // exits early if command doesn't exist
      if (!command) return;

      // if command exists, tries to carry out "execute" function
      try {
        await command.execute(interaction as CommandInteraction, this.client);
      } catch (e) {
        logger.error(e);
        await interaction.followUp({
          content: '❌ | error executing this command',
          ephemeral: true
        });
      }
    }
  };
}
