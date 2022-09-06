import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../../structures/bot";
import Command from "../../../structures/command";

class Avatar extends Command {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName('avatar')
                .setDescription("🔬 get a user's avatar")
                .addUserOption((option) =>
                    option
                        .setName('target')
                        .setDescription('member to fetch the avatar from')
                )
                .toJSON()
        );
        this.developer = true;
    }

    public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
        const member =
        interaction.options.getUser('target') || interaction.user;

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({
                iconURL: member.displayAvatarURL(),
                name: member.tag,
            })
            .setImage(member.avatarURL({ size: 2048 }));

        await interaction.reply({
            embeds: [embed],
        });
    }
}

export default new Avatar()