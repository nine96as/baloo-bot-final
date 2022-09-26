import { Bot } from './bot.js';
import { ClientEvents } from 'discord.js';

export interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  execute(client: Bot, ...args: unknown[]): void | Promise<void>;
}
