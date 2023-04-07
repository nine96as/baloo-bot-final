import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  ComponentType,
  GuildTextBasedChannel,
  GuildMember
} from 'discord.js';
import { Bot } from '#structures';
import { Command, Embed } from '#interfaces';

export const command = {
  folder: 'utility',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('get the list of available commands'),
  execute: async (interaction: ChatInputCommandInteraction, client: Bot) => {
    if (interaction.inCachedGuild()) {
      const channel = interaction.channel as GuildTextBasedChannel;

      const directories = [
        ...new Set(client.commands.map((cmd) => cmd.folder))
      ];

      const categories = directories.map((dir) => {
        const getCommands = client.commands
          .filter((cmd) => cmd.folder === dir)
          .map((cmd) => {
            return {
              name: cmd.data.name,
              description:
                (cmd.data as SlashCommandBuilder).description ??
                'no description provided.'
            };
          });

        return {
          directory: dir,
          commands: getCommands
        };
      });

      const components = (state: boolean) => [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('help')
            .setDisabled(state)
            .addOptions(
              categories.map((cat) => {
                return {
                  label: cat.directory,
                  value: cat.directory.toLowerCase(),
                  description: `${cat.commands
                    .map((cmd) => {
                      return `${cmd.name}`;
                    })
                    .join(', ')}`
                };
              })
            )
        )
      ];

      const initialMessage = await interaction.reply({
        embeds: [
          new Embed()
            .setColor('Random')
            .setAuthor({
              name: `${client.user?.username}`,
              iconURL: client.user?.displayAvatarURL()
            })
            .setDescription(
              `welcome to the help section, where you will be able to see all commands.`
            )
            .addField(
              'commands',
              `> use the select menu below to access commands, which are split up into different categories.`
            )
        ],
        components: components(false)
      });

      const filter = (interaction: StringSelectMenuInteraction) =>
        interaction.user.id === (interaction.member as GuildMember).user.id;

      const collector = channel.createMessageComponentCollector({
        filter: filter,
        time: 180000,
        componentType: ComponentType.StringSelect
      });

      collector.on(
        'collect',
        async (interaction: StringSelectMenuInteraction) => {
          const [directory] = interaction.values;
          const category = categories.find(
            (x) => x.directory.toLowerCase() === directory
          );

          if (!category) return;

          const categoryEmbed = new Embed()
            .setColor('Random')
            .setAuthor({
              name: `${client.user?.username}`,
              iconURL: client.user?.displayAvatarURL()
            })
            .setTitle(`${directory} commands.`)
            .setDescription(
              category.commands
                .map((cmd) => {
                  return `\`/${cmd.name}\` - ${cmd.description}`;
                })
                .join('\n')
            );

          interaction.update({
            embeds: [categoryEmbed]
          });
        }
      );

      collector.on('end', () => {
        initialMessage.edit({ components: components(true) });
      });
    }
  }
} satisfies Command;
