import { Bot } from '#structures';
import {
  AutocompleteInteraction,
  CommandInteraction,
  ContextMenuCommandBuilder,
  InteractionResponse,
  Message,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';

/**
 * Represents a command that can be executed by a user in a Discord server.
 */
export interface Command {
  /**
   * The parent folder of the command.
   */
  folder: string;

  /**
   * The data used to define the command, which could be one of several types depending on the type of command.
   */
  data:
    | ContextMenuCommandBuilder
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder;

  /**
   * Executes the logic for the command when it is invoked by a user.
   * @param interaction - The interaction object representing the command invocation event.
   * @param client - The Discord bot client instance that received the event.
   * @returns A promise that resolves to a `InteractionResponse<boolean>`, `Message<boolean>`, or void.
   */
  execute(
    interaction: CommandInteraction,
    client: Bot
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void>;

  /**
   * Executes the logic for the command when a user is selecting an autocomplete option.
   * @param interaction - The interaction object representing the autocomplete event.
   * @param client - The Discord bot client instance that received the event.
   * @returns A promise that resolves to void.
   */
  autocomplete?(
    interaction: AutocompleteInteraction,
    client: Bot
  ): Promise<void>;
}
