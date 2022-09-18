import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  ContextMenuCommandBuilder
} from 'discord.js';
import { Command } from '../../../structures/command';
import { Embed } from '../../../structures/embed';

export const command: Command = {
  data: new ContextMenuCommandBuilder()
    .setName('getAvatar')
    .setType(ApplicationCommandType.User),

  async execute(interaction: UserContextMenuCommandInteraction) {
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
};
