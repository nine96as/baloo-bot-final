import { ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import Bot from "../../../../structures/bot";
import Button from "../../../../structures/button";

class Rewind extends Button {
    constructor() {
        super(
            'rewind',
            new ButtonBuilder()
                .setCustomId('rewind')
                .setLabel('⏮️')
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

            if (queue.previousTracks.length > 1) {
                await queue.back();
                return interaction.editReply(
                    '⏮️ | rewinded to previous track!'
                );
            } else {
                return interaction.editReply(
                    '❌ | no previous track to rewind to'
                );
            }
        }
    }
}

export default new Rewind()