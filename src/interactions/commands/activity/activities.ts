import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';

class Activities extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('activities')
        .setDescription(
          '💡 creates an invite for an activity in a voice channel'
        )
        .addStringOption((option) =>
          option
            .setName('activity')
            .setDescription('activity to start')
            .addChoices(
              { name: 'Poker Night', value: '1' },
              { name: 'Betrayal', value: '2' },
              { name: 'Fishington', value: '3' },
              { name: 'watch YouTube', value: '4' },
              { name: 'Land-io', value: '5' },
              { name: 'Doodle Crew', value: '6' },
              { name: 'Putt Party', value: '7' }
            )
            .setRequired(true)
        )
        .toJSON()
    );
    this.developer = true;
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const { options, member } = interaction;
      const choices = options.getString('activity');

      const app = client.together;

      const vc = member.voice.channel;

      if (!vc) {
        return await interaction.followUp({
          content: '❌ | please join a voice channel first!',
          ephemeral: true
        });
      }

      switch (choices) {
        case '1':
          app.createTogetherCode(vc.id, 'poker').then((invite) =>
            interaction.followUp({
              content: `click **[here](${invite.code})** to join the activity`
            })
          );
          break;
        case '2':
          app.createTogetherCode(vc.id, 'betrayal').then((invite) =>
            interaction.followUp({
              content: `click **[here](${invite.code})** to join the activity`
            })
          );
          break;
        case '3':
          app.createTogetherCode(vc.id, 'fishington').then((invite) =>
            interaction.followUp({
              content: `click **[here](${invite.code})** to join the activity`
            })
          );
          break;
        case '4':
          app.createTogetherCode(vc.id, 'youtube').then((invite) =>
            interaction.followUp({
              content: `click **[here](${invite.code})** to join the activity`
            })
          );
          break;
        case '5':
          app.createTogetherCode(vc.id, 'land').then((invite) =>
            interaction.followUp({
              content: `click **[here](${invite.code})** to join the activity`
            })
          );
        case '6':
          app.createTogetherCode(vc.id, 'doodlecrew').then((invite) =>
            interaction.followUp({
              content: `click **[here](${invite.code})** to join the activity`
            })
          );
          break;
        case '7':
          app.createTogetherCode(vc.id, 'puttparty').then((invite) =>
            interaction.followUp({
              content: `click **[here](${invite.code})** to join the activity`
            })
          );
          break;
      }
    }
  }
}

export default new Activities();
