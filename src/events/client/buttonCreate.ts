import { Events, Interaction, ButtonInteraction } from "discord.js";
import logger from "../../utils/functions/logger";
import Bot from '../../structures/bot'
import Event from '../../structures/event'

export default class ButtonCreate implements Event {
    client: Bot;
    name = Events.InteractionCreate;

    constructor(client: Bot) {
        this.client = client;
    }

    execute = async (interaction: Interaction) => {
        if (interaction.isButton()) {
            // checks if button exists in buttons collection
            const button = this.client.buttons.get(interaction.customId);
        
            // exits early if button doesn't exist
            if (!button) return;
        
            // if button exists, tries to carry out "execute" function
            try {
                await interaction.deferReply({ ephemeral: true });
                await button.execute(interaction as ButtonInteraction, this.client);
            } catch (e) {
                logger.error(e);
                await interaction.editReply({
                    content: '❌ | error executing this button',
                });
            }
        }
    }
}

