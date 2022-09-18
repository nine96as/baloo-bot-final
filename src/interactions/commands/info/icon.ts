import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../../structures/command';
import { Embed } from '../../../structures/embed';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('icon')
    .setDescription('🔬 get the server icon'),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { guild } = interaction;

      await interaction.reply({
        embeds: [
          new Embed()
            .setColor('Random')
            .setAuthor({
              name: guild.name,
              iconURL: guild.iconURL() || undefined
            })
            .setImage(guild.iconURL({ size: 4096 }))
        ]
      });
    }
  }
};
