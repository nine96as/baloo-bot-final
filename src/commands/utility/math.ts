import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, Embed } from '#structures';
import { emojis } from '#assets';

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
        .setName('sub')
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
        .setName('mul')
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
        .setName('div')
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
        .setName('mod')
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
        .setName('pow')
        .setDescription('🧮 find power of inputted number')
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
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'add') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***${num1} + ${num2} = ${num1 + num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'sub') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***${num1} - ${num2} = ${num1 - num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'mul') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***${num1} * ${num2} = ${num1 * num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'div') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***${num1} / ${num2} = ${num1 / num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'mod') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***${num1} mod ${num2} = ${num1 % num2}***`
          )
        ]
      });
    } else if (interaction.options.getSubcommand() === 'pow') {
      const { options } = interaction;

      const num1 = options.getNumber('num1') as number;
      const num2 = options.getNumber('num2') as number;

      return interaction.reply({
        embeds: [
          new Embed().setDescription(
            `${emojis.math} ***${num1} ^ ${num2} = ${num1 ** num2}***`
          )
        ]
      });
    }
  }
};