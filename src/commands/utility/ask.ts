import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Bot } from '#structures';
import { Command, Embed, ErrorEmbed } from '#interfaces';

export const command = {
  folder: 'utility',
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('ask anything!')
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('question to ask the bot')
        .setRequired(true)
        .setMaxLength(1024)
    )
    .addBooleanOption((option) =>
      option
        .setName('visible')
        .setDescription('whether the response should be shown or not')
    ),
  execute: async (interaction: ChatInputCommandInteraction, client: Bot) => {
    if (interaction.inCachedGuild()) {
      const { options } = interaction;

      const visible = options.getBoolean('visible') ?? false;
      const question = options.getString('question', true);
      const user = interaction.user;

      if (!question) {
        return interaction.reply({
          embeds: [new ErrorEmbed('***noQuestionProvided***')],
          ephemeral: true
        });
      }

      await interaction.deferReply({ ephemeral: visible });

      const systemPrompt = `
        Your name is baloo, you are a friendly chatbot created by nine96. 
        Answer as concisely as possible.
        Current date: ${new Date().toString()}
      `;

      const response = await client.ai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { name: user.username, role: 'user', content: question }
        ]
      });

      const text =
        response.data.choices[0].message?.content ??
        "I don't know what to say...";

      await interaction.editReply({
        embeds: [
          new Embed()
            .setColor('Random')
            .setTitle(`> ${question.toLowerCase()}`)
            .setFooter({
              text: `${client.user?.username}`,
              iconURL: client.user?.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(text)
        ]
      });
    }
  }
} satisfies Command;
