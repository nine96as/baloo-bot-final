import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, Embed } from '#structures';
import { emojis } from '#assets';
import { getRandomInt } from '#functions';

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
    .setDescription('rolls the dice (d6 by default)')
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
    )
    .addIntegerOption((option) =>
      option
        .setName('count')
        .setDescription('number of dice to roll')
        .setMinValue(1)
        .setMaxValue(5)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const { options } = interaction;

    const side = options.getNumber('sides');
    const min = 1;
    const max = sides.find((s) => side === s.value)?.value || 6;
    const count = options.getInteger('count') || 1;

    if (count === 1) {
      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.dice} ***rolled ${getRandomInt(min, max)}!***`
          )
        ]
      });
    } else {
      const results: number[] = [];

      for (let i = 0; i < count; i++) results.push(getRandomInt(min, max));

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.dice} ***rolled ${results.join(', ')}!***`
          )
        ]
      });
    }
  }
};
