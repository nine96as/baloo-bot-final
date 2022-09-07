import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';

class Banner extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
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
        )
        .toJSON()
    );
    this.developer = true;
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.options.getSubcommand() === 'user') {
      if (interaction.inCachedGuild()) {
        const member =
          interaction.options.getMember('target') || interaction.member;

        await member.user.fetch(true);

        const embed = new EmbedBuilder()
          .setColor('Random')
          .setAuthor({
            iconURL: member.user.displayAvatarURL(),
            name: member.user.tag
          })
          .setImage(member.user.bannerURL({ size: 4096 }) || null);

        member.user.bannerURL()
          ? await interaction.reply({
              embeds: [embed]
            })
          : interaction.reply("❌ | this user doesn't have a banner");
      }
    } else if (interaction.options.getSubcommand() === 'server') {
      if (interaction.inCachedGuild()) {
        const guild = interaction.guild;

        const embed = new EmbedBuilder()
          .setColor('Random')
          .setAuthor({
            iconURL: guild.iconURL() || undefined,
            name: guild.name
          })
          .setImage(guild.bannerURL({ size: 4096 }));

        guild.bannerURL()
          ? await interaction.reply({
              embeds: [embed]
            })
          : interaction.reply("❌ | this server doesn't have a banner");
      }
    }
  }
}

export default new Banner();
