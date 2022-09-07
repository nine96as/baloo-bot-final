import { ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import Bot from "../../../../structures/bot";
import Button from "../../../../structures/button";

class Stop extends Button {
    constructor() {
        super(
            'stop',
            new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('⏹️')
                .setStyle(ButtonStyle.Danger)
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

            queue.destroy();

            return interaction.editReply('⏹️ | cya!');
        }
    }
}

export default new Stop()