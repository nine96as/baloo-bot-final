import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import { Command } from '#interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('modal')
    .setDescription('returns a modal'),

  async execute(interaction: ChatInputCommandInteraction) {
    const favColour = new ModalBuilder()
      .setCustomId('favColour')
      .setTitle('fav colour?')
      .addComponents(
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('favColourInput')
            .setLabel('what is your fav colour?')
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        )
      );

    return interaction.showModal(favColour);
  }
};
