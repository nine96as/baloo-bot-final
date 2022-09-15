import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  ContextMenuCommandBuilder
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import { Embed } from '../../../structures/embed';

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

    await interaction.reply({
      embeds: [
        new Embed()
          .setColor('Random')
          .setAuthor({
            iconURL: member.displayAvatarURL(),
            name: member.tag
          })
          .setImage(member.avatarURL({ size: 4096 }))
      ]
    });
  }
}

export default new GetAvatar();
