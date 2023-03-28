import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Bot } from '#structures';
import { Command, Embed, ErrorEmbed } from '#interfaces';

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('ask anything!')
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('question to ask the bot')
        .setRequired(true)
        .setMaxLength(1024)
    ),

  async execute(interaction: ChatInputCommandInteraction, client: Bot) {
    if (interaction.inCachedGuild()) {
      const { options } = interaction;

      const question = options.getString('question', true);
      const user = interaction.user;

      if (!question) {
        return interaction.reply({
          embeds: [new ErrorEmbed('***noQuestionProvided***')],
          ephemeral: true
        });
      }

      await interaction.deferReply({ ephemeral: true });

      const systemPrompt = `
        You are a friendly chatbot. 
        Answer as concisely as possible.
        Current date: ${new Date().toString()}
      `;

      const response = await client.ai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            name: client.user?.username,
            role: 'system',
            content: systemPrompt
          },
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
            .setTitle(question)
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
};
