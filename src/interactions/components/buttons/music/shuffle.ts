import { ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import Bot from "../../../../structures/bot";
import Button from "../../../../structures/button";

class Shuffle extends Button {
    constructor() {
        super(
            'shuffle',
            new ButtonBuilder()
                .setCustomId('shuffle')
                .setLabel('🔀')
                .setStyle(ButtonStyle.Secondary)
        );
    }

    public async execute(interaction: ButtonInteraction, client: Bot) {
        if (interaction.inCachedGuild()) {
            // checks if user is in a voice channel
            if (!interaction.member.voice.channel) {
                return interaction.editReply('❌ | please join a voice channel first!');
            }

            const queue = client.player.getQueue(interaction.guildId);

            // checks if queue is empty
            if (!queue) {
                return interaction.editReply(
                    '❌ | there are no songs in the queue'
                );
            }

            queue.shuffle();

            await interaction.editReply('🔀 | queue has been shuffled!');
        }
    }
}

export default new Shuffle()