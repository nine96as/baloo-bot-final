import { ModalSubmitInteraction } from 'discord.js';
import { Modal, Embed, SuccessEmbed } from '#interfaces';

export const modal: Modal = {
  customId: 'embed',
  async execute(interaction: ModalSubmitInteraction) {
    const { fields, channel } = interaction;

    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description') || null;
    const image = fields.getTextInputValue('image') || null;
    const thumbnail = fields.getTextInputValue('thumbnail') || null;
    const footer = fields.getTextInputValue('footer') || ' ';

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
