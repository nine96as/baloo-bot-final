import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Bot, Command, ErrorEmbed, SuccessEmbed } from '#structures';
import { Playlist, Queue, Song } from 'discord-music-player';
import { logger } from '#functions';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('⏯️ plays a song/playlist')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('song')
        .setDescription('⏯️ plays a song')
        .addStringOption((option) =>
          option
            .setName('song')
            .setDescription('the song to be queued')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('playlist')
        .setDescription('⏯️ plays a playlist')
        .addStringOption((option) =>
          option
            .setName('playlist')
            .setDescription('the playlist to be queued')
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const { member } = interaction;

      const vc = member.voice.channel;

      if (!vc) {
        return interaction.reply({
          embeds: [new ErrorEmbed('***notInVC***')],
          ephemeral: true
        });
      }

      let queue: Queue | undefined = client.player.getQueue(
        interaction.guildId
      );

      if (!queue) {
        queue = client.player.createQueue(interaction.guildId, {
          data: { channelId: interaction.channelId }
        });

        // verify vc connection
        try {
          await queue.join(interaction.member.voice.channelId as string);
          logger.info(
            `no queue found for guild ${interaction.guild.name} (${interaction.guildId}), creating new queue.`
          );
        } catch (e) {
          queue.leave();
          return interaction.reply({
            embeds: [new ErrorEmbed('***joinVCError***')],
            ephemeral: true
          });
        }
      } else {
        // checks if user is in same vc as bot
        if (
          queue.connection?.channel.id !== interaction.member.voice.channelId
        ) {
          return interaction.reply({
            embeds: [new ErrorEmbed('***notInSameVCAsBot***')],
            ephemeral: true
          });
        }
      }

      if (interaction.options.getSubcommand() == 'song') {
        const song = interaction.options.getString('song', true);
        let queuedSong: Song;

        interaction.deferReply();

        try {
          queuedSong = await queue.play(song, {
            requestedBy: interaction.user
          });
        } catch (e) {
          logger.error(e);
          return await interaction.followUp({
            embeds: [new ErrorEmbed('***songPlayError***')],
            ephemeral: true
          });
        }

        return await interaction.followUp({
          embeds: [
            new SuccessEmbed(
              `***[${queuedSong.name}](${queuedSong.url}) added to queue.***`
            )
          ]
        });
      } else if (interaction.options.getSubcommand() == 'playlist') {
        const playlist = interaction.options.getString('playlist', true);
        let queuedPlaylist: Playlist;

        interaction.deferReply();

        try {
          queuedPlaylist = await queue.playlist(playlist, {
            requestedBy: interaction.user
          });
        } catch (e) {
          logger.error(e);
          return await interaction.followUp({
            embeds: [new ErrorEmbed('***playlistPlayError***')],
            ephemeral: true
          });
        }

        let fields = [];
        queuedPlaylist.songs.slice(0, 9).map((song, index) => {
          fields.push({
            name: `${index + 1}. ${song.name}`,
            value: `duration: ${song.duration}`
          });
        });

        if (queuedPlaylist.songs.length > 9) {
          fields.push({
            name: 'additional songs',
            value: `${queuedPlaylist.songs.length - 9} more songs`
          });
        }

        return await interaction.followUp({
          embeds: [
            new SuccessEmbed(
              `***[${queuedPlaylist.songs.length}] songs from [${queuedPlaylist.name}](${queuedPlaylist.url}) have been added to queue.***`
            )
          ]
        });
      }
    }
  }
};
