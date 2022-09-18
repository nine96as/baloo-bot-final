import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import { QueryType, QueueRepeatMode } from 'discord-player';
import { Bot } from '../../../structures/bot';
import { Command } from '../../../structures/command';
import { Embed, ErrorEmbed, SuccessEmbed } from '../../../structures/embed';
import emojis from '../../../utils/assets/emojis';
const ms = require('ms');

export const command: Command = {
  data: new SlashCommandBuilder()
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
      subcommand
        .setName('seek')
        .setDescription('⏩ goes to specified timestamp of track')
        .addStringOption((option) =>
          option
            .setName('time')
            .setDescription('timestamp to skip to')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('🗑️ removes song from queue')
        .addIntegerOption((option) =>
          option
            .setName('song')
            .setDescription('position of song to remove')
            .setMinValue(1)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('move')
        .setDescription(
          '🛒 moves song to a different position in the queue'
        )
        .addIntegerOption((option) =>
          option
            .setName('oldpos')
            .setDescription('position of song to move')
            .setMinValue(1)
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName('newpos')
            .setDescription('new position of song')
            .setMinValue(1)
            .setRequired(true)
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
            .setDescription('volume level to be set')
            .setMinValue(1)
            .setMaxValue(100)
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
    ),

  async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      if (interaction.options.getSubcommand() === 'play') {
        const { options, member, channel, guild, user } = interaction;

        const song = options.getString('song');

        // checks if user is in a voice channel
        if (!member.voice.channel) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***notInVC***')],
            ephemeral: true
          });
        }

        const queue = client.player.createQueue(guild, {
          metadata: {
            channel: channel
          }
        });

        // verify vc connection
        try {
          if (!queue.connection) {
            await queue.connect(member.voice.channel);
          }
        } catch (e) {
          queue.destroy();
          return await interaction.followUp({
            embeds: [new ErrorEmbed('***joinVCError***')],
            ephemeral: true
          });
        }

        const result = await client.player.search(song!, {
          requestedBy: user,
          searchEngine: QueryType.AUTO
        });

        // checks if result was successfully fetched
        if (!result || !result.tracks.length) {
          return await interaction.followUp({
            embeds: [new ErrorEmbed('***noResults***')],
            ephemeral: true
          });
        }

        result.playlist
          ? queue.addTracks(result.tracks)
          : queue.addTrack(result.tracks[0]);

        await interaction.followUp({
          embeds: [
            new SuccessEmbed(
              `***${result.playlist ? 'playlist' : 'song'} added to queue***`
            )
          ]
        });

        if (!queue.playing) await queue.play();
      } else if (interaction.options.getSubcommand() === 'pause') {
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

        queue.setPaused(true);

        return interaction.followUp({
          embeds: [new SuccessEmbed('***music paused!***')]
        });
      } else if (interaction.options.getSubcommand() === 'resume') {
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

        queue.setPaused(false);

        return interaction.followUp({
          embeds: [new SuccessEmbed('***music resumed!***')]
        });
      } else if (interaction.options.getSubcommand() === 'queue') {
        const { member, guild, guildId, options } = interaction;

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

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
        const page = (options.getNumber('page') || 1) - 1;

        // checks if inputted page num exceeds total page number
        if (page > totalPages) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***invalidPage***')],
            ephemeral: true
          });
        }

        // const pages = [];
        const pageStart = page * 10;
        const pageEnd = pageStart + 10;

        const currentTrack = queue.current;
        const tracks = queue.tracks
          .slice(pageStart, pageEnd)
          .map((track, i) => {
            return `**${pageStart + i + 1}.** \`[${track.duration}]\` [${
              track.title
            }](${track.url})`;
          })
          .join('\n');

        return await interaction.followUp({
          embeds: [
            new Embed()
              .setColor('Random')
              .setTitle(`queue for ${guild.name}`)
              .setDescription(
                `**🎶 now playing**\n` +
                  (currentTrack
                    ? `\`[${currentTrack.duration}]\`` +
                      ` [${currentTrack.title}](${currentTrack.url})`
                    : 'none') +
                  `\n\n**🗒️ queue**\n${tracks}`
              )
              .setFooter({
                text: `page ${page + 1} of ${totalPages}`
              })
              .setThumbnail(currentTrack.thumbnail)
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('rewind')
                .setLabel('⏮️')
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId('skip')
                .setLabel('⏭️')
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId('loop')
                .setLabel('🔁')
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId('shuffle')
                .setLabel('🔀')
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('⏹️')
                .setStyle(ButtonStyle.Danger)
            )
          ]
        });
      } else if (interaction.options.getSubcommand() === 'skip') {
        const { member, guildId } = interaction;

        // checks if user is in a voice channel
        if (!member.voice.channel) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***notInVC***')],
            ephemeral: true
          });
        }

        const queue = client.player.getQueue(guildId);

        // checks if there is anything playing
        if (!queue || !queue.playing) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***nothingPlaying***')],
            ephemeral: true
          });
        }

        queue.skip();

        return await interaction.followUp({
          embeds: [new SuccessEmbed(`***song skipped***`)]
        });
      } else if (interaction.options.getSubcommand() === 'stop') {
        const { member, guildId } = interaction;

        // checks if user is in a voice channel
        if (!member.voice.channel) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***notInVC***')],
            ephemeral: true
          });
        }

        const queue = client.player.getQueue(guildId);

        // checks if there is anything playing
        if (!queue || !queue.playing) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***nothingPlaying***')],
            ephemeral: true
          });
        }

        queue.destroy();

        return await interaction.followUp({
          embeds: [new SuccessEmbed('***music stopped***')]
        });
      } else if (interaction.options.getSubcommand() === 'volume') {
        const { member, guildId, options } = interaction;

        // checks if user is in a voice channel
        if (!member.voice.channel) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***notInVC***')],
            ephemeral: true
          });
        }

        const queue = client.player.getQueue(guildId);

        // checks if there is anything playing
        if (!queue || !queue.playing) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***nothingPlaying***')],
            ephemeral: true
          });
        }

        const volume = options.getInteger('level');

        if (!volume) {
          return interaction.followUp({
            embeds: [
              new Embed().setDescription(
                `${emojis.music.volume} ***volume = ${queue.volume}***`
              )
            ]
          });
        }

        queue.setVolume(volume);
        return interaction.followUp({
          embeds: [new SuccessEmbed(`***volume set to \`${volume}\`***`)]
        });
      } else if (interaction.options.getSubcommand() === 'loop') {
        const { member, guildId, options } = interaction;

        // checks if user is in a voice channel
        if (!member.voice.channel) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***notInVC***')],
            ephemeral: true
          });
        }

        const queue = client.player.getQueue(guildId);

        // checks if there is anything playing
        if (!queue || !queue.playing) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***nothingPlaying***')],
            ephemeral: true
          });
        }

        const mode = options.getString('mode');

        switch (mode) {
          case 'off':
            queue.setRepeatMode(QueueRepeatMode.OFF);
            interaction.followUp({
              embeds: [new SuccessEmbed(`***looping ${mode}!***`)]
            });
            break;
          case 'queue':
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            interaction.followUp({
              embeds: [new SuccessEmbed(`***looping ${mode}!***`)]
            });
            break;
          case 'track':
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            interaction.followUp({
              embeds: [new SuccessEmbed(`***looping ${mode}!***`)]
            });
            break;
        }
      } else if (interaction.options.getSubcommand() === 'shuffle') {
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
      } else if (interaction.options.getSubcommand() === 'nowplaying') {
        const { member, guildId } = interaction;

        // checks if user is in a voice channel
        if (!member.voice.channel) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***notInVC***')],
            ephemeral: true
          });
        }

        const queue = client.player.getQueue(guildId);

        // checks if there is anything playing
        if (!queue || !queue.playing) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***nothingPlaying***')],
            ephemeral: true
          });
        }

        return interaction.followUp({
          embeds: [
            new Embed()
              .setColor('Random')
              .setTitle('🎶 now playing')
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
              )
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('rewind')
                .setLabel('⏮️')
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId('pausePlay')
                .setLabel('⏯️')
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId('skip')
                .setLabel('⏭️')
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId('loop')
                .setLabel('🔁')
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('⏹️')
                .setStyle(ButtonStyle.Danger)
            )
          ]
        });
      } else if (interaction.options.getSubcommand() === 'clearqueue') {
        const { member, guildId } = interaction;

        // checks if user is in a voice channel
        if (!member.voice.channel) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***notInVC***')],
            ephemeral: true
          });
        }

        const queue = client.player.getQueue(guildId);

        // checks if there is anything playing
        if (!queue || !queue.playing) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***nothingPlaying***')],
            ephemeral: true
          });
        }

        queue.clear();

        return interaction.followUp({
          embeds: [new SuccessEmbed('***cleared queue!***')]
        });
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

        if (queue.previousTracks.length > 1) {
          await queue.back();
          return interaction.followUp({
            content: '⏮️ | rewinded to previous track!',
            embeds: [new SuccessEmbed('***rewinded successfully***')]
          });
        } else {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***noPreviousTrack***')],
            ephemeral: true
          });
        }
      } else if (interaction.options.getSubcommand() === 'remove') {
        const { member, guildId, options } = interaction;

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

        const song = Number(options.getInteger('song'));
        const trackIndex = song - 1;

        if (!queue.tracks[trackIndex]) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***invalidTrackPosition***')],
            ephemeral: true
          });
        }

        queue.remove(trackIndex);

        return interaction.followUp({
          embeds: [new SuccessEmbed('***removed track!***')]
        });
      } else if (interaction.options.getSubcommand() === 'move') {
        const { member, guildId, options } = interaction;

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

        const oldPos = Number(options.getInteger('oldpos'));
        const newPos = Number(options.getInteger('newpos'));
        const trackIndex = oldPos - 1;

        if (!queue.tracks[trackIndex]) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***invalidTrackPosition***')],
            ephemeral: true
          });
        }

        const track = queue.remove(trackIndex);
        queue.insert(track, newPos - 1);

        return interaction.followUp({
          embeds: [new SuccessEmbed(`***moved track to pos \`${newPos}\`***`)]
        });
      } else if (interaction.options.getSubcommand() === 'seek') {
        const { member, guildId, options } = interaction;

        // checks if user is in a voice channel
        if (!member.voice.channel) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***notInVC***')],
            ephemeral: true
          });
        }

        const queue = client.player.getQueue(guildId);

        // checks if there is anything playing
        if (!queue || !queue.playing) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***nothingPlaying***')],
            ephemeral: true
          });
        }

        const time = options.getString('time');
        const timeMS = ms(time);

        if (timeMS >= queue.current.durationMS) {
          return interaction.followUp({
            embeds: [new ErrorEmbed('***invalidTimestamp***')],
            ephemeral: true
          });
        }

        await queue.seek(timeMS);

        return await interaction.followUp({
          embeds: [new SuccessEmbed(`***seeking to \`${time}\`***`)]
        });
      }
    }
  }
}
