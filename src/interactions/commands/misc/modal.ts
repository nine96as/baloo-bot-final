import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import Bot from "../../../structures/bot";
import Command from "../../../structures/command";
import favColour from "../../components/modals/favColour";

class Modal extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('modal')
                .setDescription('📑 returns a modal')
                .toJSON()
        );
        this.developer = true;
    }

    public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
        interaction.showModal(favColour.data);
    }
}

export default new Modal()