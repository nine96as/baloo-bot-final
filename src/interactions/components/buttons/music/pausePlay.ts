import { ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import Bot from "../../../../structures/bot";
import Button from "../../../../structures/button";

class PausePlay extends Button {
    constructor() {
        super(
            'pausePlay',
            new ButtonBuilder()
                .setCustomId('pausePlay')
                .setLabel('⏯️')
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

            // checks if there is anything playing
            if (!queue || !queue.playing) {
                return interaction.editReply(
                    '❌ | no music is being played in this guild'
                );
            }

            // variable x used to validate whether pause can be carried out
            const x = queue.setPaused(true);

            // if it fails, then set to play
            if (!x) queue.setPaused(false);

            return interaction.editReply(
                x ? '⏸️ | music has been paused!' : '▶️ | music has been resumed!'
            );
        }
    }
}

export default new PausePlay()