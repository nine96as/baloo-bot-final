import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { PlayerManager } from 'discord-player-plus';
import { DiscordTogether } from 'discord-together';
import { loadCommands } from '#handlers/commands';
import { loadEvents } from '#handlers/events';
import { loadButtons } from '#handlers/buttons';
import { loadSelects } from '#handlers/selects';
import { loadModals } from '#handlers/modals';
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
  player = new PlayerManager();
  together = new DiscordTogether(this);

  constructor(token: string) {
    super({
      intents: [Guilds, GuildMessages, GuildMembers, GuildVoiceStates]
    });

    this.init(token);
  }

  async init(token: string) {
    await loadEvents(this);
    await loadCommands(this);
    this.login(token);
  }
}
