import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  ContextMenuCommandBuilder
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import translate from '@iamtraction/google-translate';
import { Embed } from '../../../structures/embed';
import emojis from '../../../utils/assets/emojis';

class Translate extends Command {
  constructor() {
    super(
      new ContextMenuCommandBuilder()
        .setName('translate')
        .setType(ApplicationCommandType.Message)
    );
  }

  public async execute(
    interaction: UserContextMenuCommandInteraction,
    client: Bot
  ) {
    if (interaction.inCachedGuild()) {
      const { channel, targetId } = interaction;

      const query = await channel?.messages.fetch({ message: targetId });
      const rawMsg = query?.content;

      const translatedMsg = await translate(rawMsg!, { to: 'en' });

      return interaction.followUp({
        embeds: [
          new Embed()
            .setColor('Random')
            .setTitle(`${emojis.translate} translate`)
            .addFields([
              { name: 'raw', value: '```' + rawMsg + '```' },
              { name: 'translated', value: '```' + translatedMsg.text + '```' }
            ])
        ]
      });
    }
  }
}

export default new Translate();
