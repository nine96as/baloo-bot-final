import { Interaction, SelectMenuInteraction } from 'discord.js';
import { Bot } from '../../structures/bot';
import { Event } from '../../structures/event';
import { ErrorEmbed } from '../../structures/embed';
import logger from '../../utils/functions/logger';

export const event: Event = {
  name: 'interactionCreate',
  async execute(client: Bot, interaction: Interaction) {
    if (interaction.isSelectMenu()) {
      // checks if menu exists in menus collection
      const menu = client.menus.get(interaction.customId);

      // exits early if menu doesn't exist
      if (!menu) return;

      // if menu exists, tries to carry out "execute" function
      try {
        await menu.execute(interaction as SelectMenuInteraction, client);
      } catch (e) {
        logger.error(e);
        await interaction.reply({
          embeds: [new ErrorEmbed('***menuExecuteError***')],
          ephemeral: true
        });
      }
    }
  }
}
