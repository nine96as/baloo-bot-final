import { Bot } from './bot.js';
import { ButtonInteraction, Message, InteractionResponse } from 'discord.js';

/**
 * Represents a button component that can be attached to a message or an embed.
 */
export interface Button {
  /**
   * A unique identifier for the button.
   */
  customId: string;

  /**
   * Executes the logic for the button when it is clicked by a user.
   * @param interaction - The interaction object representing the button click event.
   * @param client - The Discord bot client instance that received the event.
   * @returns A promise that resolves to an interaction response, a message, or void.
   */
  execute(
    interaction: ButtonInteraction,
    client: Bot
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void>;
}
