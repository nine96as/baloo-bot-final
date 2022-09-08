import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder
} from 'discord.js';
import { QueryType, QueueRepeatMode } from 'discord-player';
import Bot from '../../../structures/bot';
import Command from '../../../structures/command';
import rewind from '../../components/buttons/music/rewind';
import skip from '../../components/buttons/music/skip';
import loop from '../../components/buttons/music/loop';
import shuffle from '../../components/buttons/music/shuffle';
import stop from '../../components/buttons/music/stop';
import pausePlay from '../../components/buttons/music/pausePlay';

class Music extends Command {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('music')
        .setDescription('🎶 carry out various music operations')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('play')
            .setDescription('⏯️ plays a song/playlist')
            .addStringOption((option) =>
              option
                .setName('song')
                .setDescription('the song to play')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand.setName('pause').setDescription('⏸️ pauses music')
        )
        .addSubcommand((subcommand) =>
          subcommand.setName('resume').setDescription('⏯️ resumes music')
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('queue')
            .setDescription('📄 displays song queue')
            .addNumberOption((option) =>
              option
                .setName('page')
                .setDescription('page number of queue')
                .setMinValue(1)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand.setName('skip').setDescription('⏭️ skips current song')
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('rewind')
            .setDescription('⏮️ rewinds to previous song')
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('stop')
            .setDescription('⏹️ stops all music and clears queue')
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('volume')
            .setDescription('🔊 check or set volume')
            .addIntegerOption((option) =>
              option
                .setName('level')
                .setDescription('volume level to be set (1-100)')
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('loop')
            .setDescription('🔁 set loop modes')
            .addStringOption((option) =>
              option
                .setName('mode')
                .setDescription('loop mode to be set')
                .addChoices(
                  { name: 'off', value: 'off' },
                  { name: 'queue', value: 'queue' },
                  { name: 'track', value: 'track' }
                )
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('shuffle')
            .setDescription('🔀 shuffles current queue')
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('nowplaying')
            .setDescription('🎶 displays info about currently playing song')
        )
        .addSubcommand((subcommand) =>
          subcommand.setName('clearqueue').setDescription('🧼 clears queue')
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('lyrics')
            .setDescription('📜 fetch lyrics of currently playing song')
        )
        .toJSON()
    );
    this.developer = true;
  }

  public async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      try {
        if (interaction.options.getSubcommand() === 'play') {
          const song = interaction.options.getString('song');

          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.createQueue(interaction.guild, {
            metadata: {
              channel: interaction.channel
            }
          });

          // verify vc connection
          try {
            if (!queue.connection) {
              await queue.connect(interaction.member.voice.channel);
            }
          } catch (e) {
            queue.destroy();
            return await interaction.followUp({
              content: '❌ | could not join your voice channel!',
              ephemeral: true
            });
          }

          const result = await client.player.search(song!, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
          });

          // checks if result was successfully fetched
          if (!result || !result.tracks.length) {
            return await interaction.followUp({
              content: `❌ | nothing was found when searching for: ${result}`,
              ephemeral: true
            });
          }

          const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(
              `▶️ | new ${result.playlist ? 'playlist' : 'song'} ` +
              `added to queue`
            );

          // checks if result is a single track or a playlist
          if (!result.playlist) {
            const track = result.tracks[0];
            embed.setThumbnail(track.thumbnail);
            embed.setDescription(`**[${track.title}](${track.url})**`);
            embed.setFooter({ text: `duration: ${track.duration}` });
          }

          result.playlist
            ? queue.addTracks(result.tracks)
            : queue.addTrack(result.tracks[0]);

          await interaction.followUp({ embeds: [embed] });

          if (!queue.playing) await queue.play();
        } else if (interaction.options.getSubcommand() === 'pause') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if queue is empty
          if (!queue) {
            return await interaction.followUp({
              content: '❌ | there are no songs in the queue',
              ephemeral: true
            });
          }

          queue.setPaused(true);

          return await interaction.followUp('⏸️ | music has been paused!');
        } else if (interaction.options.getSubcommand() === 'resume') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if queue is empty
          if (!queue) {
            return await interaction.followUp({
              content: '❌ | there are no songs in the queue',
              ephemeral: true
            });
          }

          queue.setPaused(false);

          return await interaction.followUp('▶️ | music has been resumed!');
        } else if (interaction.options.getSubcommand() === 'queue') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if queue is empty
          if (!queue) {
            return await interaction.followUp({
              content: '❌ | there are no songs in the queue',
              ephemeral: true
            });
          }

          const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
          const page = (interaction.options.getNumber('page') || 1) - 1;

          // checks if inputted page num exceeds total page number
          if (page > totalPages) {
            return await interaction.followUp({
              content: `❌ | page provided invalid; there are only ${totalPages} 
                            pages of songs`,
              ephemeral: true
            });
          }

          //   const pages = [];
          const pageStart = page * 10;
          const pageEnd = pageStart + 10;

          const currentTrack = queue.current;
          const tracks = queue.tracks
            .slice(pageStart, pageEnd)
            .map((track, i) => {
              return `**${pageStart + i + 1}.** \`[${track.duration}]\` [${track.title
                }](${track.url})`;
            })
            .join('\n');

          const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`queue for ${interaction.guild.name}`)
            .setDescription(
              `**🎶 | now playing**\n` +
              (currentTrack
                ? `\`[${currentTrack.duration}]\`` +
                ` [${currentTrack.title}](${currentTrack.url})`
                : 'none') +
              `\n\n**🗒️ | queue**\n${tracks}`
            )
            .setFooter({
              text: `page ${page + 1} of ${totalPages}`
            })
            .setThumbnail(currentTrack.thumbnail);

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            rewind.data,
            skip.data,
            loop.data,
            shuffle.data,
            stop.data
          );

          return await interaction.followUp({
            embeds: [embed],
            components: [row]
          });
        } else if (interaction.options.getSubcommand() === 'skip') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if there is anything playing
          if (!queue || !queue.playing) {
            return await interaction.followUp({
              content: '❌ | no music is being played in this guild',
              ephemeral: true
            });
          }

          const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`⏭️ | song skipped`)
            .setDescription(
              `**[${queue.nowPlaying().title}]` +
              `(${queue.nowPlaying().url})**`
            )
            .setThumbnail(queue.nowPlaying().thumbnail);

          queue.skip();

          return await interaction.followUp({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === 'stop') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if there is anything playing
          if (!queue || !queue.playing) {
            return await interaction.followUp({
              content: '❌ | no music is being played in this guild',
              ephemeral: true
            });
          }

          queue.destroy();

          return await interaction.followUp('⏹️ | cya!');
        } else if (interaction.options.getSubcommand() === 'volume') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if there is anything playing
          if (!queue || !queue.playing) {
            return await interaction.followUp({
              content: '❌ | no music is being played in this guild',
              ephemeral: true
            });
          }

          const volume = interaction.options.getInteger('level');

          if (!volume) {
            return interaction.followUp(`🔊 | volume: ${queue.volume}`);
          } else if (volume == 0 || volume > 100) {
            return await interaction.followUp({
              content: '❌ | volume must be within 1-100',
              ephemeral: true
            });
          }

          const v = queue.setVolume(volume);
          return await interaction.followUp(
            v ? `🔊 | volume set to ${volume}` : `❌ | volume change failed!`
          );
        } else if (interaction.options.getSubcommand() === 'loop') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if there is anything playing
          if (!queue || !queue.playing) {
            return await interaction.followUp({
              content: '❌ | no music is being played in this guild',
              ephemeral: true
            });
          }

          const mode = interaction.options.getString('mode');

          if (mode === 'off') {
            const x = queue.setRepeatMode(QueueRepeatMode.OFF);
            return await interaction.followUp(
              x ? `🔁 | looping ${mode}!` : `❌ | loop mode change failed`
            );
          } else if (mode === 'queue') {
            const x = queue.setRepeatMode(QueueRepeatMode.QUEUE);
            return await interaction.followUp(
              x ? `🔁 | looping ${mode}!` : `❌ | loop mode change failed`
            );
          } else if (mode === 'track') {
            const x = queue.setRepeatMode(QueueRepeatMode.TRACK);
            return await interaction.followUp(
              x ? `🔁 | looping ${mode}!` : `❌ | loop mode change failed`
            );
          }
        } else if (interaction.options.getSubcommand() === 'shuffle') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if queue is empty
          if (!queue) {
            return await interaction.followUp({
              content: '❌ | there are no songs in the queue',
              ephemeral: true
            });
          }

          queue.shuffle();

          return await interaction.followUp('🔀 | queue has been shuffled!');
        } else if (interaction.options.getSubcommand() === 'nowplaying') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if there is anything playing
          if (!queue || !queue.playing) {
            return await interaction.followUp({
              content: '❌ | no music is being played in this guild',
              ephemeral: true
            });
          }

          const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('🎶 | now playing')
            .setDescription(
              `[${queue.nowPlaying().title}](${queue.nowPlaying().url})`
            )
            .setThumbnail(queue.nowPlaying().thumbnail)
            .addFields(
              { name: 'by', value: queue.nowPlaying().author },
              {
                name: 'duration',
                value: queue.nowPlaying().duration + 's'
              },
              {
                name: 'requested by',
                value: `<@${queue.nowPlaying().requestedBy.id}>`
              },
              {
                name: 'progress',
                value: queue.createProgressBar({ timecodes: true })
              }
            );

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            rewind.data,
            pausePlay.data,
            skip.data,
            loop.data,
            stop.data
          );

          return await interaction.followUp({
            embeds: [embed],
            components: [row]
          });
        } else if (interaction.options.getSubcommand() === 'clearqueue') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if there is anything playing
          if (!queue || !queue.playing) {
            return await interaction.followUp({
              content: '❌ | no music is being played in this guild',
              ephemeral: true
            });
          }

          queue.clear();

          return await interaction.followUp('🧼 | successfully cleared queue!');
        } else if (interaction.options.getSubcommand() === 'lyrics') {
          // // checks if user is in a voice channel
          // if (!interaction.member.voice.channel) {
          //     return interaction.followUp(
          //         'please join a voice channel first!'
          //     );
          // }
          // const queue = client.player.getQueue(
          //     interaction.guildId
          // );
          // // checks if there is anything playing
          // if (!queue || !queue.playing) {
          //     return interaction.followUp(
          //         'no music is being played in this guild'
          //     );
          // }
          // const track = queue.nowPlaying();
          // let lyrics = null;
          // // lyric finder
          // try {
          //     lyrics = await finder(track.title, '');
          //     if (!lyrics) lyrics = `no lyrics found.`;
          // } catch (e) {
          //     lyrics = `no lyrics found.`;
          // }
          // const embed = new EmbedBuilder()
          //     .setColor('Random')
          //     .setTitle(`lyrics for ${track.title}`)
          //     .setDescription(`[link](${track.url})\n\n${lyrics}`)
          //     .setThumbnail(`${track.thumbnail}`);
          // // // checks if character count exceeds limit for a discord message
          // // if (embed.description.length >= 4096) {
          // //     embed.description = `${embed.description.substr(0, 4095)}...`
          // // }
          // return interaction.followUp({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === 'rewind') {
          // checks if user is in a voice channel
          if (!interaction.member.voice.channel) {
            return await interaction.followUp({
              content: '❌ | please join a voice channel first!',
              ephemeral: true
            });
          }

          const queue = client.player.getQueue(interaction.guildId);

          // checks if queue is empty
          if (!queue) {
            return await interaction.followUp({
              content: '❌ | there are no songs in the queue',
              ephemeral: true
            });
          }

          if (queue.previousTracks.length > 1) {
            await queue.back();
            return await interaction.followUp(
              '⏮️ | rewinded to previous track!'
            );
          } else {
            return await interaction.followUp({
              content: '❌ | no previous track to rewind to',
              ephemeral: true
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export default new Music();
