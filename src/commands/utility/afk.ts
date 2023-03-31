import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, SuccessEmbed } from '#interfaces';
import { prisma } from '#utils';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('configure AFK settings')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('set/update your AFK status')
        .addStringOption((option) =>
          option
            .setName('status')
            .setDescription('status to be set/updated')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('remove').setDescription('return from being AFK')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'set') {
      if (interaction.inCachedGuild()) {
        const { options, user, guildId } = interaction;
        const status = options.getString('status') as string;

        await prisma.afkSystem.upsert({
          where: { userId: user.id },
          create: { userId: user.id, guildId: guildId, status: status },
          update: { userId: user.id }
        });

        return interaction.reply({
          embeds: [
            new SuccessEmbed(`***${user} has gone AFK: \`${status}\`***`)
          ]
        });
      }
    } else if (interaction.options.getSubcommand() === 'remove') {
      const { user } = interaction;

      await prisma.afkSystem.delete({
        where: { userId: user.id }
      });

      return interaction.reply({
        embeds: [new SuccessEmbed(`***${user}, your AFK has been removed***`)]
      });
    }
  }
};
