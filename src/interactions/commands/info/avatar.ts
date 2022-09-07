import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';

class Avatar extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("🔬 get a user's avatar")
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('member to fetch the avatar from')
        )
        .toJSON()
    );
    this.developer = true;
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const member =
        interaction.options.getMember('target') || interaction.member;

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({
          iconURL: member.user.displayAvatarURL(),
          name: member.user.tag
        })
        .setImage(member.user.avatarURL({ size: 4096 }));

      await interaction.reply({
        embeds: [embed]
      });
    }
  }
}

export default new Avatar();
