import { Events, Interaction, ModalSubmitInteraction } from 'discord.js';
import logger from '../../utils/functions/logger';
import Bot from '../../structures/bot';
import Event from '../../structures/event';

export default class ModalCreate implements Event {
  client: Bot;
  name = Events.InteractionCreate;

  constructor(client: Bot) {
    this.client = client;
  }

  execute = async (interaction: Interaction) => {
    if (interaction.isModalSubmit()) {
      // checks if modal exists in modal collection
      const modal = this.client.modals.get(interaction.customId);

      // exists early if modal doesn't exist
      if (!modal) return;

      // if modal exists, tries to carry out "execute" function
      try {
        await modal.execute(interaction as ModalSubmitInteraction, this.client);
      } catch (e) {
        logger.error(e);
        await interaction.reply({
          content: '❌ | error executing this modal',
          ephemeral: true
        });
      }
    }
  };
}
