import { ModalSubmitInteraction } from 'discord.js';
import { Modal, Embed } from '#interfaces';

export const modal = {
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
} satisfies Modal;
