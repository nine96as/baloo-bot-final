import { Bot } from './bot.js';
import { ButtonInteraction, Message, InteractionResponse } from 'discord.js';

export interface Button {
  customId: string;
  execute(
    interaction: ButtonInteraction,
    client: Bot
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void>;
}
