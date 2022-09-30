import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import { Command } from '#structures';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('📰 create a basic embed'),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new ModalBuilder()
      .setCustomId('embed')
      .setTitle('Embed Builder')
      .addComponents(
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('title')
            .setLabel('embed title')
            .setPlaceholder('enter title')
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('description')
            .setLabel('embed description')
            .setPlaceholder('enter description')
            .setStyle(TextInputStyle.Paragraph)
        ),
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('image')
            .setLabel('image URL')
            .setPlaceholder('enter URL')
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('thumbnail')
            .setLabel('thumbnail URL')
            .setPlaceholder('enter URL')
            .setStyle(TextInputStyle.Short)
        ),
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('footer')
            .setLabel('embed footer')
            .setPlaceholder('enter footer')
            .setStyle(TextInputStyle.Short)
        )
      );

    return interaction.showModal(embed);
  }
};
