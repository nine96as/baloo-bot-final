import { QueueRepeatMode } from "discord-player";
import { ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import Bot from "../../../../structures/bot";
import Button from "../../../../structures/button";

class Loop extends Button {
    constructor() {
        super(
            'loop',
            new ButtonBuilder()
                .setCustomId('loop')
                .setLabel('🔁')
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

            const modes = ['off', 'track', 'queue'];
            const repeatMode = queue.repeatMode;

            if (repeatMode === 0) {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
            } else if (repeatMode === 1) {
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
            } else if (repeatMode === 2) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
            }

            return interaction.editReply(
                `🔁 | looping ${modes[queue.repeatMode]}!`
            );
        }
    }
}

export default new Loop()