import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  ContextMenuCommandBuilder
} from 'discord.js';
import { Command, Embed, WarnEmbed } from '#interfaces';

export const command = {
  folder: 'context',
  data: new ContextMenuCommandBuilder()
    .setName('getBanner')
    .setType(ApplicationCommandType.User),
  execute: async (interaction: UserContextMenuCommandInteraction) => {
    if (interaction.inCachedGuild()) {
      const { targetMember } = interaction;
      const member = targetMember;

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
            embeds: [new WarnEmbed('***This user does not have a banner.***')],
            ephemeral: true
          });
    }
  }
} satisfies Command;
