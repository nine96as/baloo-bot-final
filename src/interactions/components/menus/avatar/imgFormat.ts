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
      'imgFormatAvatar',
      new SelectMenuBuilder().setCustomId('imgFormatAvatar').addOptions(options)
    );
  }

  public async execute(interaction: SelectMenuInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const imgFormat = interaction.values[0];
      const member = interaction.user;

      const recievedEmbed = interaction.message.embeds[0];
      const embed = EmbedBuilder.from(recievedEmbed).setColor('Random');

      switch (imgFormat) {
        case 'png':
          embed.setImage(member.avatarURL({ extension: 'png' }));
        case 'jpg':
          embed.setImage(member.avatarURL({ extension: 'jpg' }));
        case 'webp':
          embed.setImage(member.avatarURL({ extension: 'webp' }));
        case 'gif':
          embed.setImage(member.avatarURL({ extension: 'gif' }));
      }
      return interaction.editReply({ embeds: [embed] });
    }
  }
}

export default new ImageFormat();
