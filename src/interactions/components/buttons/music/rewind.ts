import { ButtonInteraction } from 'discord.js';
import { Bot } from '../../../../structures/bot';
import { Button } from '../../../../structures/button';

export const button: Button = {
  customId: 'rewind',
  async execute(interaction: ButtonInteraction, client: Bot) {
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

      if (queue.previousTracks.length > 1) {
        await queue.back();
        return interaction.editReply('⏮️ | rewinded to previous track!');
      } else {
        return interaction.editReply('❌ | no previous track to rewind to');
      }
    }
  }
}

