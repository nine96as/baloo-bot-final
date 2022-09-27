import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '#structures/command';
import { Embed } from '#structures/embed';
import emojis from '#assets/emojis';

const sides = [
  { name: 'd4', value: 4 },
  { name: 'd6', value: 6 },
  { name: 'd8', value: 8 },
  { name: 'd10', value: 10 },
  { name: 'd12', value: 4 },
  { name: 'd20', value: 20 }
];

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('🎲 rolls the dice (d6 by default)')
    .addNumberOption((option) =>
      option
        .setName('sides')
        .setDescription('number of sides')
        .addChoices(
          { name: 'd4', value: 4 },
          { name: 'd6', value: 6 },
          { name: 'd8', value: 8 },
          { name: 'd10', value: 10 },
          { name: 'd12', value: 4 },
          { name: 'd20', value: 20 }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const { options } = interaction;

    const side = options.getNumber('sides');
    const min = 1;
    const max = sides.find((s) => side === s.value)?.value || 6;

    interaction.reply({
      embeds: [
        new Embed().setDescription(
          `${emojis.dice} ***rolled ${
            Math.floor(Math.random() * max) + min
          }!***`
        )
      ]
    });
  }
};
