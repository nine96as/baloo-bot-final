import { ModalSubmitInteraction } from 'discord.js';
import { Modal } from '#structures/modal';
import { Embed } from '#structures/embed';

export const modal: Modal = {
  customId: 'favColour',
  async execute(interaction: ModalSubmitInteraction) {
    const { fields } = interaction;

    const favColour = fields.getTextInputValue('favColourInput');

    return interaction.reply({
      embeds: [
        new Embed().setDescription(`🎨 ***fav colour = ${favColour}***`)
      ],
      ephemeral: true
    });
  }
};
