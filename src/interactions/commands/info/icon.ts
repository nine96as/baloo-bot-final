import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../../structures/bot";
import Command from "../../../structures/command";

class Icon extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
            .setName('icon')
            .setDescription('🔬 get the server icon')
            .toJSON()
        );
        this.developer = true;
    }

    public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
        if (interaction.inCachedGuild()) {
            const guild = interaction.guild;

            const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({
                name: guild.name,
                iconURL: guild.iconURL() || undefined,
            })
            .setImage(guild.iconURL({ size: 2048 }));

            await interaction.reply({
                embeds: [embed],
            });
        }
    }
}

export default new Icon()