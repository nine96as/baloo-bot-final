import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  EmbedBuilder
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';

class GetAvatar extends Command {
  constructor() {
    super(
      new ContextMenuCommandBuilder()
        .setName('getAvatar')
        .setType(ApplicationCommandType.User)
    );
  }

  public async execute(
    interaction: UserContextMenuCommandInteraction,
    client: Bot
  ) {
    const member = interaction.targetUser;

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setAuthor({
        iconURL: member.displayAvatarURL(),
        name: member.tag
      })
      .setImage(member.avatarURL({ size: 2048 }));

    await interaction.reply({
      embeds: [embed]
    });
  }
}

export default new GetAvatar();
