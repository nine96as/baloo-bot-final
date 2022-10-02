import { Bot } from './bot.js';
import {
  AutocompleteInteraction,
  CommandInteraction,
  ContextMenuCommandBuilder,
  InteractionResponse,
  Message,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  UserContextMenuCommandInteraction
} from 'discord.js';

export interface Command {
  developer?: boolean;
  data:
    | ContextMenuCommandBuilder
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder;
  autocomplete?(
    interaction: AutocompleteInteraction,
    client: Bot
  ): Promise<void>;
  execute(
    interaction:
      | MessageContextMenuCommandInteraction
      | UserContextMenuCommandInteraction
      | CommandInteraction,
    client: Bot
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void>;
}
