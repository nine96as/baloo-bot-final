import {
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  EmbedBuilder
} from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import translate from '@iamtraction/google-translate';

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

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('translate')
        .addFields([
          { name: 'raw', value: '```' + rawMsg + '```' },
          { name: 'translated', value: '```' + translatedMsg.text + '```' }
        ]);

      return interaction.followUp({
        embeds: [embed]
      });
    }
  }
}

export default new Translate();
