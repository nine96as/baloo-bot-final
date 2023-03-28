import { Bot } from '#structures';
import { ClientEvents } from 'discord.js';

/**
 * Represents a Discord event to be handled by the bot.
 */
export interface Event {
  /**
   * A property that defines the name of the event to handle.
   */
  name: keyof ClientEvents;

  /**
   * An optional boolean property that indicates whether the event should only be handled once
   * (i.e., not for subsequent occurrences of the event).
   */
  once?: boolean;

  /**
   * Executes the logic for the event.
   * @param client - The Discord bot client instance that received the event.
   * @param args - The arguments passed to the event
   * @returns A promise that resolves to void.
   */
  execute(client: Bot, ...args: unknown[]): void | Promise<void>;
}
