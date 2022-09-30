import { ModalSubmitInteraction } from 'discord.js';
import { Modal, Embed, SuccessEmbed } from '#structures';

export const modal: Modal = {
  customId: 'embed',
  async execute(interaction: ModalSubmitInteraction) {
    const { fields, channel } = interaction;

    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description');
    const image = fields.getTextInputValue('image');
    const thumbnail = fields.getTextInputValue('thumbnail');
    const footer = fields.getTextInputValue('footer');

    await interaction.reply({
      embeds: [new SuccessEmbed(`***embed created***`)]
    });

    setTimeout(async () => interaction.deleteReply(), 5000);

    channel?.send({
      embeds: [
        new Embed()
          .setTitle(title)
          .setDescription(description)
          .setImage(image)
          .setThumbnail(thumbnail)
          .setFooter({ text: footer })
      ]
    });
  }
};
