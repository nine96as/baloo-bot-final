import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction
} from 'discord.js';
import { Command } from '#structures/command';
import { Embed } from '#structures/embed';
import emojis from '#assets/emojis';
import translate from '@iamtraction/google-translate';

export const command: Command = {
  data: new ContextMenuCommandBuilder()
    .setName('translate')
    .setType(ApplicationCommandType.Message),

  async execute(interaction: MessageContextMenuCommandInteraction) {
    if (interaction.inCachedGuild()) {
      const { channel, targetId } = interaction;

      const query = await channel?.messages.fetch({ message: targetId });
      const rawMsg = query?.content;

      const translatedMsg = await translate(rawMsg!, { to: 'en' });

      return interaction.reply({
        embeds: [
          new Embed()
            .setColor('Random')
            .setTitle(`${emojis.translate} translate`)
            .addFields([
              { name: '***raw***', value: '```' + rawMsg + '```' },
              {
                name: '***translated***',
                value: '```' + translatedMsg.text + '```'
              }
            ])
        ]
      });
    }
  }
};
