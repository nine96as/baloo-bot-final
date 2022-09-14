import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import { Embed } from '../../../structures/embed';
import emojis from '../../../utils/assets/emojis';

class Ping extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 sends a ping request!')
        .toJSON()
    );
    this.developer = true;
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    const msg = await interaction.reply({
      embeds: [
        new Embed()
         .setDescription(`${emojis.ping} ***pong!***`)
      ],
      fetchReply: true
    });

    await interaction.editReply({
      embeds: [
        new Embed()
         .setDescription(`${emojis.ping} ***pong!*** \`${msg.createdTimestamp - interaction.createdTimestamp}ms\``)
      ]
    })
  }
}

export default new Ping();
