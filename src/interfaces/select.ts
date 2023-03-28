import { Bot } from '#structures';
import {
  AnySelectMenuInteraction,
  InteractionResponse,
  Message
} from 'discord.js';

/**
 * Represents a select menu that can be interacted with by a user in a Discord server.
 */
export interface SelectMenu {
  /**
   * A string that represents the custom ID of the select menu.
   */
  customId: string;

  /**
   * Executes the logic for the select menu when a user submits a select menu form.
   * @param interaction - The interaction object representing the interaction that triggered the select menu submission.
   * @param client - The Discord bot client instance that received the event.
   * @returns A promise that resolves to a `InteractionResponse<boolean>`, `Message<boolean>`, or void.
   */
  execute(
    interaction: AnySelectMenuInteraction,
    client: Bot
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void>;
}
