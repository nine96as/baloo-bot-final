import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChannelType,
  ThreadAutoArchiveDuration
} from 'discord.js';
import {
  Command,
  Embed,
  ErrorEmbed,
  SuccessEmbed,
  WarnEmbed
} from '#interfaces';
import { logger, prisma } from '#utils';

export const command = {
  folder: 'utility',
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('🗨️ start a conversation with the bot!'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.inCachedGuild()) {
      const { channel, user } = interaction;

      if (!channel || channel.type !== ChannelType.GuildText) {
        return interaction.reply({
          embeds: [new WarnEmbed('***You cannot start a conversation here.***')]
        });
      }

      try {
        const thread = await channel.threads.create({
          type: ChannelType.PrivateThread,
          name: `conversation with ${user.tag}`,
          autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
          rateLimitPerUser: 10,
          startMessage: ''
        });

        await thread.members.add(user);

        interaction.reply({
          ephemeral: true,
          embeds: [
            new SuccessEmbed(`***generated conversation thread for ${user}***`)
          ]
        });

        await prisma.channel.upsert({
          where: { channelId: channel.id },
          create: { channelId: channel.id, guildId: interaction.guildId },
          update: { channelId: channel.id }
        });

        await prisma.thread.upsert({
          where: { threadId: thread.id },
          create: {
            guildId: interaction.guildId,
            channelId: channel.id,
            threadId: thread.id
          },
          update: { threadId: thread.id }
        });

        await prisma.chatbotSystem
          .upsert({
            where: { threadId: thread.id },
            create: {
              userId: user.id,
              guildId: interaction.guildId,
              channelId: channel.id,
              threadId: thread.id
            },
            update: { threadId: thread.id }
          })
          .then(() => {
            logger.info(
              `thread [${thread.name}] (${thread.id}) successfully created.`,
              {
                label: 'event'
              }
            );
          });

        thread.send({
          embeds: [
            new Embed()
              .setColor('Random')
              .setDescription(`> ***hi ${user}, how can I help you today?***`)
          ]
        });
      } catch (e) {
        logger.error(e);
        return interaction.reply({
          embeds: [
            new ErrorEmbed(
              `***Error while creating conversation thread for ${user}***`
            )
          ],
          ephemeral: true
        });
      }
    }
  }
} satisfies Command;
