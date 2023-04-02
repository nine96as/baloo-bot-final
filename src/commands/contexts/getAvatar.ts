import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  ContextMenuCommandBuilder
} from 'discord.js';
import { Command, Embed } from '#interfaces';

export const command = {
  data: new ContextMenuCommandBuilder()
    .setName('getAvatar')
    .setType(ApplicationCommandType.User),
  execute: async (interaction: UserContextMenuCommandInteraction) => {
    const { targetUser } = interaction;
    const member = targetUser;

    return interaction.reply({
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
} satisfies Command;
