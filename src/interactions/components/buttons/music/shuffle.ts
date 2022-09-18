import { ButtonInteraction } from 'discord.js';
import { Bot } from '../../../../structures/bot';
import { Button } from '../../../../structures/button';
import { ErrorEmbed, SuccessEmbed } from '../../../../structures/embed';

export const button: Button = {
  customId: 'shuffle',
  async execute(interaction: ButtonInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const { member, guildId } = interaction;

        // checks if user is in a voice channel
        if (!member.voice.channel) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***notInVC***')],
            ephemeral: true
          });
        }

        const queue = client.player.getQueue(guildId);

        // checks if queue is empty
        if (!queue) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***queueEmpty***')],
            ephemeral: true
          });
        }

        queue.shuffle();

        return interaction.followUp({
          embeds: [new SuccessEmbed(`***queue shuffled!***`)]
        });
    }
  }
}

