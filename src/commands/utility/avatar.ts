import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, Embed } from '#interfaces';

export const command = {
  folder: 'utility',
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("🔬 get a user's avatar")
    .addUserOption((option) =>
      option.setName('target').setDescription('member to fetch the avatar from')
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
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
} satisfies Command;
