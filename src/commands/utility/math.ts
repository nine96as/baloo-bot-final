import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction
} from 'discord.js';
import { Command, Embed } from '#structures';
import { emojis } from '#assets';
import { getRandomInt } from 'utils';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('math')
    .setDescription('🧮 complete arithmetic operations')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('🧮 add 2 numbers')
        .addNumberOption((option) =>
          option
            .setName('num1')
            .setDescription('first number')
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName('num2')
            .setDescription('second number')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('subtract')
        .setDescription('🧮 subtract 2 numbers')
        .addNumberOption((option) =>
          option
            .setName('num1')
            .setDescription('first number')
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName('num2')
            .setDescription('second number')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('multiply')
        .setDescription('🧮 multiply 2 numbers')
        .addNumberOption((option) =>
          option
            .setName('num1')
            .setDescription('first number')
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName('num2')
            .setDescription('second number')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('divide')
        .setDescription('🧮 divide 2 numbers')
        .addNumberOption((option) =>
          option
            .setName('num1')
            .setDescription('first number')
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName('num2')
            .setDescription('second number')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('modulo')
        .setDescription('🧮 find modulo of 2 numbers')
        .addNumberOption((option) =>
          option
            .setName('num1')
            .setDescription('first number')
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName('num2')
            .setDescription('second number')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('power')
        .setDescription('🧮 find power of inputted number')
        .addNumberOption((option) =>
          option.setName('num1').setDescription('base value').setRequired(true)
        )
        .addNumberOption((option) =>
          option.setName('num2').setDescription('power').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('sqrt')
        .setDescription('🧮 find square root of inputted number')
        .addNumberOption((option) =>
          option
            .setName('num')
            .setDescription('number to take square root from')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('cbrt')
        .setDescription('🧮 find cube root of inputted number')
        .addNumberOption((option) =>
          option
            .setName('num')
            .setDescription('number to take cube root from')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('constants')
        .setDescription('🧮 mathematical constants')
        .addStringOption((option) =>
          option
            .setName('constant')
            .setDescription('constant to return')
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('random')
        .setDescription('🧮 returns random number within a specified range')
        .addNumberOption((option) =>
          option
            .setName('min')
            .setDescription('minimum value')
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName('max')
            .setDescription('maximum value')
            .setRequired(true)
        )
    ),

  async autocomplete(interaction: AutocompleteInteraction) {
    const { options } = interaction;

    const focusedOption = options.getFocused(true);
    let choices;

    if (focusedOption.name === 'constant') {
      choices = ['pi', 'e'];
    }

    const filtered = (choices as string[]).filter((c) =>
      c.startsWith(focusedOption.value)
    );

    await interaction.respond(filtered.map((c) => ({ name: c, value: c })));
  },

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'add') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***add(${num1}, ${num2}) = ${num1 + num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'subtract') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***subtract(${num1}, ${num2}) = ${num1 - num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'multiply') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***multiply(${num1}, ${num2}) = ${num1 * num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'divide') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***divide(${num1}, ${num2}) = ${num1 / num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'modulo') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***modulo(${num1}, ${num2}) = ${num1 % num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'power') {
      const { options } = interaction;

      const base = options.getNumber('base') as number;
      const power = options.getNumber('power') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***power(${base}, ${power}) = ${base ** power}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'sqrt') {
      const { options } = interaction;

      const num = options.getNumber('num') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***sqrt(${num}) = ${Math.sqrt(num)}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'cbrt') {
      const { options } = interaction;

      const num = options.getNumber('num') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***cbrt(${num}) = ${Math.cbrt(num)}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'constants') {
      const { options } = interaction;

      const constant = options.getString('constant');

      constant == 'pi'
        ? interaction.reply({
            embeds: [
              new Embed().setDescription(`${emojis.math} ***pi = ${Math.PI}***`)
            ]
          })
        : interaction.reply({
            embeds: [
              new Embed().setDescription(`${emojis.math} ***e = ${Math.E}***`)
            ]
          });
    } else if (interaction.options.getSubcommand() === 'random') {
      const { options } = interaction;

      const min = options.getNumber('min') as number;
      const max = options.getNumber('max') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***random(${min}, ${max}) = ${getRandomInt(
              min,
              max
            )}***`
          )
        ]
      });
    }
  }
};
