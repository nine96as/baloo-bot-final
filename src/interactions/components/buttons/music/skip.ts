import { ButtonInteraction, ButtonBuilder, ButtonStyle } from 'discord.js';
import Bot from '../../../../structures/bot';
import Button from '../../../../structures/button';

class Skip extends Button {
  constructor() {
    super(
      'skip',
      new ButtonBuilder()
        .setCustomId('skip')
        .setLabel('⏭️')
        .setStyle(ButtonStyle.Secondary)
    );
  }

  public async execute(interaction: ButtonInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      // checks if user is in a voice channel
      if (!interaction.member.voice.channel) {
        return interaction.editReply('❌ | please join a voice channel first!');
      }

      const queue = client.player.getQueue(interaction.guildId);

      // checks if queue is empty
      if (!queue) {
        return interaction.editReply('❌ | there are no songs in the queue');
      }

      const skip = queue.skip();
      return interaction.editReply(
        skip ? '⏭️ | song skipped' : '❌ | failed to skip track'
      );
    }
  }
}

export default new Skip();
