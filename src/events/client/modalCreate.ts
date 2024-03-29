import { Interaction, ModalSubmitInteraction, Events } from 'discord.js';
import { Bot } from '#structures';
import { Event, ErrorEmbed } from '#interfaces';
import { logger } from '#utils';

export const event = {
  name: Events.InteractionCreate,
  execute: async (client: Bot, interaction: Interaction) => {
    if (interaction.isModalSubmit()) {
      // Checks if modal exists in modal collection.
      const modal = client.modals.get(interaction.customId);

      // Exists early if modal doesn't exist.
      if (!modal) return;

      // Exits early if modal wasn't called in recognised guild.
      if (!interaction.inCachedGuild()) return;

      // If modal exists, tries to carry out "execute" function.
      try {
        await modal.execute(interaction as ModalSubmitInteraction, client);
        logger.info(`modal ${modal.customId} executed.`);
      } catch (e) {
        logger.error(e);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            embeds: [new ErrorEmbed('***Error while executing this modal.***')],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [new ErrorEmbed('***Error while executing this modal.***')],
            ephemeral: true
          });
        }
      }
    }
  }
} satisfies Event;
