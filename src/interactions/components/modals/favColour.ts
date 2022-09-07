import {
  ModalSubmitInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  CacheType
} from 'discord.js';
import Bot from '../../../structures/bot';
import Modal from '../../../structures/modal';

const textInput = new TextInputBuilder()
  .setCustomId('favColourInput')
  .setLabel('what is your fav colour?')
  .setRequired(true)
  .setStyle(TextInputStyle.Short);

const row = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);

class FavColour extends Modal {
  constructor() {
    super(
      'favColour',
      new ModalBuilder()
        .setCustomId('favColour')
        .setTitle('fav colour?')
        .addComponents(row)
    );
  }

  public async execute(
    interaction: ModalSubmitInteraction<CacheType>,
    client: Bot
  ) {
    const favColour = interaction.fields.getTextInputValue('favColourInput');
    return await interaction.reply({
      content: `your fav colour is ${favColour}`,
      ephemeral: true
    });
  }
}

export default new FavColour();
