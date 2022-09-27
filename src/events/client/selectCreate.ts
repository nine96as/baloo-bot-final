import { Interaction, SelectMenuInteraction } from 'discord.js';
import { Bot, Event, ErrorEmbed } from '#structures';
import { logger } from '#functions';

export const event: Event = {
  name: 'interactionCreate',
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isSelectMenu()) {
      // checks if menu exists in menus collection
      const menu = client.selects.get(interaction.customId);

      // exits early if menu doesn't exist
      if (!menu) return;

      // if menu exists, tries to carry out "execute" function
      try {
        await menu.execute(interaction as SelectMenuInteraction, client);
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
