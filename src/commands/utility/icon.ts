import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, Embed } from '#interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('icon')
    .setDescription('🔬 get the server icon'),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { guild } = interaction;

      return interaction.reply({
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
