import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { DiscordTogether } from 'discord-together';
import {
  loadEvents,
  loadCommands,
  loadButtons,
  loadSelects,
  loadModals
} from '#handlers';
import { Command } from './command.js';
import { Button } from './button.js';
import { SelectMenu } from './select.js';
import { Modal } from './modal.js';

const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } =
  GatewayIntentBits;

export class Bot extends Client {
  commands = new Collection<string, Command>();
  buttons = new Collection<string, Button>();
  selects = new Collection<string, SelectMenu>();
  modals = new Collection<string, Modal>();
  together = new DiscordTogether(this);

  constructor(token: string) {
    super({
      intents: [Guilds, GuildMessages, GuildMembers, GuildVoiceStates]
    });

    this.init(token);
  }

  async init(token: string) {
    await Promise.all([
      loadEvents(this),
      loadCommands(this),
      // loadButtons(this),
      // loadSelects(this),
      loadModals(this)
    ]);

    this.login(token);
  }
}
