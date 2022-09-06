import { Events, Interaction, SelectMenuInteraction } from 'discord.js';
import logger from '../../utils/functions/logger';
import Bot from '../../structures/bot'
import Event from '../../structures/event'

export default class SelectMenuCreate implements Event {
    client: Bot;
    name = Events.InteractionCreate;

    constructor(client: Bot) {
        this.client = client;
    }

    execute = async (interaction: Interaction) => {
        if (interaction.isSelectMenu()) {
            // checks if menu exists in menus collection
            const menu = this.client.menus.get(interaction.customId);
    
            // exits early if menu doesn't exist
            if (!menu) return;
    
            // if menu exists, tries to carry out "execute" function
            try {
                await menu.execute(interaction as SelectMenuInteraction, this.client);
            } catch (e) {
                logger.error(e);
                await interaction.reply({
                    content: '❌ | error executing this menu',
                    ephemeral: true,
                });
            }
        }
    }
}