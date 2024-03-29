import { Interaction, AnySelectMenuInteraction, Events } from 'discord.js';
import { Bot } from '#structures';
import { Event, ErrorEmbed } from '#interfaces';
import { logger } from '#utils';

export const event = {
  name: Events.InteractionCreate,
  execute: async (client: Bot, interaction: Interaction) => {
    if (interaction.isStringSelectMenu()) {
      // Checks if select menu exists in menus collection.
      const menu = client.selects.get(interaction.customId);

      // Exits early if select menu doesn't exist.
      if (!menu) return;

      // Exits early if select menu wasn't called in recognised guild.
      if (!interaction.inCachedGuild()) return;

      // If select menu exists, tries to carry out "execute" function.
      try {
        await menu.execute(interaction as AnySelectMenuInteraction, client);
        logger.info(`select menu ${menu.customId} executed.`);
      } catch (e) {
        logger.error(e);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            embeds: [
              new ErrorEmbed('***Error while executing this select menu.***')
            ],
            ephemeral: true
          });
        } else {
          await interaction.reply({
            embeds: [
              new ErrorEmbed('***Error while executing this select menu.***')
            ],
            ephemeral: true
          });
        }
      }
    }
  }
} satisfies Event;
