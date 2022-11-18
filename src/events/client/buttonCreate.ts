import { Interaction, ButtonInteraction, Events } from 'discord.js';
import { Bot, Event, ErrorEmbed } from '#structures';
import { logger } from '#functions';

export const event: Event = {
  name: Events.InteractionCreate,
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isButton()) {
      // checks if button exists in buttons collection
      const button = client.buttons.get(interaction.customId);

      // exits early if button doesn't exist
      if (!button) return;

      // if button exists, tries to carry out "execute" function
      try {
        await button.execute(interaction as ButtonInteraction, client);
      } catch (e) {
        logger.error(e);
        interaction.reply({
          embeds: [new ErrorEmbed('***buttonExecuteError***')]
        });
      }
    }
  }
};
