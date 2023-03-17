import { Interaction, ModalSubmitInteraction, Events } from 'discord.js';
import { Bot, Event, ErrorEmbed } from '#structures';
import { logger } from '#functions';

export const event: Event = {
  name: Events.InteractionCreate,
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isModalSubmit()) {
      // Checks if modal exists in modal collection.
      const modal = client.modals.get(interaction.customId);

      // Exists early if modal doesn't exist.
      if (!modal) return;

      // If modal exists, tries to carry out "execute" function.
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
