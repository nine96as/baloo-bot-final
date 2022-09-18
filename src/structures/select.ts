import { Bot } from './bot';
import {
  SelectMenuInteraction,
  InteractionResponse,
  Message
} from 'discord.js';

export interface SelectMenu {
  customId: string;
  execute(
    interaction: SelectMenuInteraction,
    client: Bot
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void>;
}
