import { Message, ThreadChannel } from 'discord.js';
import { Bot } from '#structures';
import { logger, prisma } from '#utils';
import { ChatCompletionRequestMessage } from 'openai';
import { Embed } from '#interfaces';

/**
 * Checks for a ChatbotSystem entry for a specific message author, where the chatbot
 * message is sent if the message author's id matches a currently AFK user's id.
 * @param {Message} message The message to check against.
 * @param {Bot} client The Discord bot client instance.
 */
export const sendChatbotMessage = async (message: Message, client: Bot) => {
  const { author, content } = message;
  const thread = message.channel as ThreadChannel;

  if (!thread) return;

  if (
    await prisma.chatbotSystem.findUnique({
      where: { threadId: thread.id }
    })
  ) {
    const systemPrompt = `
        Your name is baloo, you are a friendly chatbot created by nine96. 
        Answer as concisely as possible.
        Current date: ${new Date().toString()}
      `;

    const conversationLog: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    await thread.sendTyping();

    const prevMessages = await thread.messages.fetch({ limit: 100 });
    prevMessages.reverse();

    prevMessages.forEach((message) => {
      if (message.author.bot) return;
      if (message.author.id !== author.id) return;

      conversationLog.push({
        role: 'user',
        content: message.content
      });
    });

    const response = await client.ai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversationLog
    });

    const text =
      response.data.choices[0].message?.content ??
      "I don't know what to say...";

    try {
      message.channel.send({
        embeds: [
          new Embed()
            .setColor('Random')
            .setTitle(`> ${content.toLowerCase()}`)
            .setFooter({
              text: `${client.user?.username}`,
              iconURL: client.user?.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(text)
        ]
      });
    } catch (e) {
      logger.error(e);
    }
  }
};
