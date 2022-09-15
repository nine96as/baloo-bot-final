import {
  SlashCommandBuilder,
  ChatInputCommandInteraction
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import { Embed } from '../../../structures/embed';

class Avatar extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('🔬 get a user\'s\ avatar')
        .addUserOption((option) =>
          option
            .setName('target')
            .setDescription('member to fetch the avatar from')
        )
        .toJSON()
    );
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const { options } = interaction;

      const member = options.getMember('target') || interaction.member;

      await interaction.reply({
        embeds: [
          new Embed()
            .setColor('Random')
            .setAuthor({
              iconURL: member.user.displayAvatarURL(),
              name: member.user.tag
            })
            .setImage(member.user.avatarURL({ size: 4096 }))
        ]
      });
    }
  }
}

export default new Avatar();
