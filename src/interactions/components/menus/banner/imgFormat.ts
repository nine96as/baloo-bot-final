import {
    SelectMenuInteraction,
    SelectMenuBuilder,
    EmbedBuilder
} from 'discord.js';
import Bot from '../../../../structures/bot';
import SelectMenu from '../../../../structures/select';

const options = [
    { label: '.png', value: 'png' },
    { label: '.jpg', value: 'jpg' },
    { label: '.webp', value: 'webp' },
    { label: '.gif', value: 'gif' }
];

class ImageFormat extends SelectMenu {
    constructor() {
        super(
            'imgFormatBanner',
            new SelectMenuBuilder().setCustomId('imgFormatBanner').addOptions(options)
        );
    }

    public async execute(interaction: SelectMenuInteraction, client: Bot) {
        if (interaction.inCachedGuild()) {
            const imgFormat = interaction.values[0];
            const member = interaction.user;

            await member.fetch(true);

            const recievedEmbed = interaction.message.embeds[0];
            const embed = EmbedBuilder.from(recievedEmbed).setColor('Random');

            switch (imgFormat) {
                case 'png':
                    embed.setImage(member.bannerURL({ extension: 'png' }) || null);
                case 'jpg':
                    embed.setImage(member.bannerURL({ extension: 'jpg' }) || null);
                case 'webp':
                    embed.setImage(member.bannerURL({ extension: 'webp' }) || null);
                case 'gif':
                    embed.setImage(member.bannerURL({ extension: 'gif' }) || null);
            }
            member.bannerURL()
                ? await interaction.editReply({
                    embeds: [embed]
                })
                : interaction.editReply("❌ | this user doesn't have a banner");
        }
    }
}

export default new ImageFormat();