import { Interaction, AnySelectMenuInteraction, Events } from 'discord.js';
import { Bot, Event, ErrorEmbed } from '#structures';
import { logger } from '#functions';

export const event: Event = {
  name: Events.InteractionCreate,
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isStringSelectMenu()) {
      // Checks if select menu exists in menus collection.
      const menu = client.selects.get(interaction.customId);

      // Exits early if select menu doesn't exist.
      if (!menu) return;

      // If select menu exists, tries to carry out "execute" function.
      try {
        await menu.execute(interaction as AnySelectMenuInteraction, client);
      } catch (e) {
        logger.error(e);
        interaction.reply({
          embeds: [new ErrorEmbed('***menuExecuteError***')],
          ephemeral: true
        });
      }
    }
  }
};
