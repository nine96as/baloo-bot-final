import { Bot } from './bot.js';
import { ClientEvents } from 'discord.js';
import { PlayerEvents } from 'discord-music-player';

export interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  execute(client: Bot, ...args: unknown[]): void | Promise<void>;
}

export interface PlayerEvent {
  name: keyof PlayerEvents;
  execute(client: Bot, ...args: unknown[]): void | Promise<void>;
}
