import { Bot } from './bot.js';
import {
  InteractionResponse,
  Message,
  ModalSubmitInteraction
} from 'discord.js';

export interface Modal {
  customId: string;
  execute(
    interaction: ModalSubmitInteraction,
    client: Bot
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void>;
}
