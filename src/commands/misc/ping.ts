import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, Embed } from '#interfaces';
import { emojis } from '#assets';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('sends a ping request!'),

  async execute(interaction: ChatInputCommandInteraction) {
    const msg = await interaction.reply({
      embeds: [new Embed().setDescription(`${emojis.ping} ***pong!***`)],
      fetchReply: true
    });

    return await interaction.editReply({
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
