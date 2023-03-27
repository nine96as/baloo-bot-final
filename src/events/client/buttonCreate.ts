import { Interaction, ButtonInteraction, Events } from 'discord.js';
import { Bot, Event, ErrorEmbed } from '#structures';
import { logger } from '#functions';

export const event: Event = {
  name: Events.InteractionCreate,
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isButton()) {
      // Checks if button exists in buttons collection.
      const button = client.buttons.get(interaction.customId);

      // Exits early if button doesn't exist.
      if (!button) return;

      // Exits early if button wasn't called in recognised guild.
      if (!interaction.inCachedGuild()) return;

      // If button exists, tries to carry out "execute" function.
      try {
        await button.execute(interaction as ButtonInteraction, client);
      } catch (e) {
        logger.error(e);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            embeds: [new ErrorEmbed('***buttonExecuteError***')],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [new ErrorEmbed('***buttonExecuteError***')],
            ephemeral: true
          });
        }
      }
    }
  }
};
