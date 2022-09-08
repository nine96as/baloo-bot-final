import {
    SelectMenuInteraction,
    SelectMenuBuilder,
    EmbedBuilder
} from 'discord.js';
import Bot from '../../../../structures/bot';
import SelectMenu from '../../../../structures/select';

const options = [
    { label: '16px', value: '16' },
    { label: '32px', value: '32' },
    { label: '64px', value: '64' },
    { label: '128px', value: '128' },
    { label: '256px', value: '256' },
    { label: '512px', value: '512' },
    { label: '1024px', value: '1024' },
    { label: '2048px', value: '2048' },
    { label: '4096px', value: '4096' },
];

class ImageQuality extends SelectMenu {
    constructor() {
        super(
            'imgQualityAvatar',
            new SelectMenuBuilder().setCustomId('imgQualityAvatar').addOptions(options)
        );
    }

    public async execute(interaction: SelectMenuInteraction, client: Bot) {
        if (interaction.inCachedGuild()) {
            const imgQuality = interaction.values[0];
            const member = interaction.user;

            const recievedEmbed = interaction.message.embeds[0];
            const embed = EmbedBuilder.from(recievedEmbed).setColor('Random');

            switch (imgQuality) {
                case '16':
                    embed.setImage(member.avatarURL({ size: 16 }));
                case '32':
                    embed.setImage(member.avatarURL({ size: 32 }));
                case '64':
                    embed.setImage(member.avatarURL({ size: 64 }));
                case '128':
                    embed.setImage(member.avatarURL({ size: 128 }));
                case '256':
                    embed.setImage(member.avatarURL({ size: 256 }));
                case '512':
                    embed.setImage(member.avatarURL({ size: 512 }));
                case '1024':
                    embed.setImage(member.avatarURL({ size: 1024 }));
                case '2048':
                    embed.setImage(member.avatarURL({ size: 2048 }));
                case '4096':
                    embed.setImage(member.avatarURL({ size: 4096 }));
            }
            return interaction.editReply({ embeds: [embed] });
        }
    }
}

export default new ImageQuality();
