import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  parseEmoji,
  PermissionFlagsBits
} from 'discord.js';
import { Command, ErrorEmbed, SuccessEmbed, WarnEmbed } from '#interfaces';
import { logger } from '#utils';

export const command = {
  data: new SlashCommandBuilder()
    .setName('emote')
    .setDescription('configure emotes')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('add an emoji to the server')
        .addStringOption((option) =>
          option
            .setName('emoji')
            .setDescription('emoji to be added')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('remove an emoji from the server')
        .addStringOption((option) =>
          option
            .setName('emoji')
            .setDescription('emoji to be removed')
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.options.getSubcommand() === 'add') {
      if (interaction.inCachedGuild()) {
        const { options, guild } = interaction;
        const emoji = options.getString('emoji') as string;

        if (!/<?(a)?:?(\w{2,32}):(\d{17,19})>?/.test(emoji)) {
          return interaction.reply({
            embeds: [new WarnEmbed('***Invalid emoji provided.***')],
            ephemeral: true
          });
        }

        const parsedEmoji = parseEmoji(options.getString('emoji') as string);

        if (parsedEmoji?.id == null)
          return interaction.reply({
            embeds: [
              new WarnEmbed(
                `***The provided emoji couldn't be found, make sure it isn't a default Discord emoji.***`
              )
            ],
            ephemeral: true
          });

        const convertedEmoji = `https://cdn.discordapp.com/emojis/${
          parsedEmoji.id
        }.${parsedEmoji.animated ? 'gif' : 'png'}?quality=lossless`;

        try {
          guild.emojis
            .create({
              attachment: convertedEmoji,
              name: parsedEmoji.name
            })
            .then(() => {
              return interaction.reply({
                embeds: [
                  new SuccessEmbed(
                    `***emoji \`${parsedEmoji.name}\` created.***`
                  )
                ]
              });
            });
        } catch (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [
              new ErrorEmbed(
                `***Error while adding emoji \`${parsedEmoji.name}\`***`
              )
            ],
            ephemeral: true
          });
        }
      }
    } else if (interaction.options.getSubcommand() === 'remove') {
      if (interaction.inCachedGuild()) {
        const { options, guild } = interaction;
        const emoji = options.getString('emoji') as string;

        if (!/<?(a)?:?(\w{2,32}):(\d{17,19})>?/.test(emoji)) {
          return interaction.reply({
            embeds: [new WarnEmbed('***Invalid emoji provided.***')],
            ephemeral: true
          });
        }

        const parsedEmoji = parseEmoji(options.getString('emoji') as string);

        if (parsedEmoji?.id == null)
          return interaction.reply({
            embeds: [
              new WarnEmbed(
                `***The provided emoji couldn't be found, make sure it isn't a default Discord emoji.***`
              )
            ],
            ephemeral: true
          });

        if (!guild.emojis.cache.find((e) => e.id == parsedEmoji.id))
          return interaction.reply({
            embeds: [
              new WarnEmbed(`***The provided emoji is not in the server.***`)
            ],
            ephemeral: true
          });

        try {
          guild.emojis.delete(parsedEmoji.id).then(() => {
            return interaction.reply({
              embeds: [
                new SuccessEmbed(`***emoji \`${parsedEmoji.name}\` deleted.***`)
              ]
            });
          });
        } catch (e) {
          logger.error(e);
          return interaction.reply({
            embeds: [
              new ErrorEmbed(
                `***Error while deleting emoji \`${parsedEmoji.name}\`***`
              )
            ],
            ephemeral: true
          });
        }
      }
    }
  }
} satisfies Command;
