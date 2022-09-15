import {
  SlashCommandBuilder,
  ChatInputCommandInteraction
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import { Embed } from '../../../structures/embed';

class Icon extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('icon')
        .setDescription('🔬 get the server icon')
        .toJSON()
    );
    this.developer = true;
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
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
}

export default new Icon();
