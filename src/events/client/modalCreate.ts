import { Interaction, ModalSubmitInteraction } from 'discord.js';
import { Bot } from '../../structures/bot';
import { Event } from '../../structures/event';
import { ErrorEmbed } from '../../structures/embed';
import logger from '../../utils/functions/logger';

export const event: Event = {
  name: 'interactionCreate',
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isModalSubmit()) {
      // checks if modal exists in modal collection
      const modal = client.modals.get(interaction.customId);

      // exists early if modal doesn't exist
      if (!modal) return;

      // if modal exists, tries to carry out "execute" function
      try {
        await modal.execute(interaction as ModalSubmitInteraction, client);
      } catch (e) {
        logger.error(e);
        interaction.reply({
          embeds: [new ErrorEmbed('***modalExecuteError***')],
          ephemeral: true
        });
      }
    }
  }
};
