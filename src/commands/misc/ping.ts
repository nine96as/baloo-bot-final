import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../../structures/command';
import { Embed } from '../../../structures/embed';
import emojis from '../../../utils/assets/emojis';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 sends a ping request!'),

  async execute(interaction: ChatInputCommandInteraction) {
    const msg = await interaction.reply({
      embeds: [new Embed().setDescription(`${emojis.ping} ***pong!***`)],
      fetchReply: true
    });

    await interaction.editReply({
      embeds: [
        new Embed().setDescription(
          `${emojis.ping} ***pong! \`${
            msg.createdTimestamp - interaction.createdTimestamp
          }ms\`***`
        )
      ]
    });
  }
};
