import { Bot } from './bot.js';
import {
  InteractionResponse,
  Message,
  ModalSubmitInteraction
} from 'discord.js';

/**
 * Represents a modal that can be interacted with by a user in a Discord server.
 */
export interface Modal {
  /**
   * A string that represents the custom ID of the modal.
   */
  customId: string;

  /**
   * Executes the logic for the modal when a user submits a modal form.
   * @param interaction - The interaction object representing the interaction that triggered the form submission.
   * @param client - The Discord bot client instance that received the event.
   * @returns A promise that resolves to a `InteractionResponse<boolean>`, `Message<boolean>`, or void.
   */
  execute(
    interaction: ModalSubmitInteraction,
    client: Bot
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void>;
}
