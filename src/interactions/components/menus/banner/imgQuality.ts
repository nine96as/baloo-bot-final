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
  { label: '4096px', value: '4096' }
];

class ImageQuality extends SelectMenu {
  constructor() {
    super(
      'imgQualityBanner',
      new SelectMenuBuilder()
        .setCustomId('imgQualityBanner')
        .addOptions(options)
    );
  }

  public async execute(interaction: SelectMenuInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const imgQuality = interaction.values[0];
      const member = interaction.user;

      await member.fetch(true);

      const recievedEmbed = interaction.message.embeds[0];
      const embed = EmbedBuilder.from(recievedEmbed).setColor('Random');

      switch (imgQuality) {
        case '16':
          embed.setImage(member.bannerURL({ size: 16 }) || null);
        case '32':
          embed.setImage(member.bannerURL({ size: 32 }) || null);
        case '64':
          embed.setImage(member.bannerURL({ size: 64 }) || null);
        case '128':
          embed.setImage(member.bannerURL({ size: 128 }) || null);
        case '256':
          embed.setImage(member.bannerURL({ size: 256 }) || null);
        case '512':
          embed.setImage(member.bannerURL({ size: 512 }) || null);
        case '1024':
          embed.setImage(member.bannerURL({ size: 1024 }) || null);
        case '2048':
          embed.setImage(member.bannerURL({ size: 2048 }) || null);
        case '4096':
          embed.setImage(member.bannerURL({ size: 4096 }) || null);
      }
      member.bannerURL()
        ? await interaction.editReply({
            embeds: [embed]
          })
        : interaction.editReply("❌ | this user doesn't have a banner");
    }
  }
}

export default new ImageQuality();
