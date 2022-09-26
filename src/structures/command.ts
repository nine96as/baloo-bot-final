import { Bot } from './bot.js';
import {
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
  execute(
    interaction:
      | MessageContextMenuCommandInteraction
      | UserContextMenuCommandInteraction
      | CommandInteraction,
    client: Bot
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void>;
}
