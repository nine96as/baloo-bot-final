import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, Embed, ErrorEmbed } from '#interfaces';

export const command = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription("🔬 get a user's banner")
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription("🔬 a user's banner")
        .addUserOption((option) =>
          option.setName('target').setDescription('the user')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('server').setDescription('🔬 the server banner')
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.options.getSubcommand() === 'user') {
      if (interaction.inCachedGuild()) {
        const { options } = interaction;

        const member = options.getMember('target') || interaction.member;

        await member.user.fetch(true);

        member.user.bannerURL()
          ? interaction.reply({
              embeds: [
                new Embed()
                  .setColor('Random')
                  .setAuthor({
                    iconURL: member.user.displayAvatarURL(),
                    name: member.user.tag
                  })
                  .setImage(member.user.bannerURL({ size: 4096 }) || null)
              ]
            })
          : interaction.reply({
              embeds: [new ErrorEmbed('***noBanner***')],
              ephemeral: true
            });
      }
    } else if (interaction.options.getSubcommand() === 'server') {
      if (interaction.inCachedGuild()) {
        const { guild } = interaction;

        guild.bannerURL()
          ? interaction.reply({
              embeds: [
                new Embed()
                  .setColor('Random')
                  .setAuthor({
                    iconURL: guild.iconURL() || undefined,
                    name: guild.name
                  })
                  .setImage(guild.bannerURL({ size: 4096 }))
              ]
            })
          : interaction.reply({
              embeds: [new ErrorEmbed('***noBanner***')],
              ephemeral: true
            });
      }
    }
  }
} satisfies Command;
