import { Client, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import { DiscordTogether } from 'discord-together';
import handleCommands from '../utils/handlers/commands';
import handleEvents from '../utils/handlers/events';
import handleButtons from '../utils/handlers/buttons';
import handleSelects from '../utils/handlers/selects';
import handleModals from '../utils/handlers/modals';

export class Bot extends Client {
  commands = handleCommands();
  buttons = handleButtons();
  selects = handleSelects();
  modals = handleModals();
  together = new DiscordTogether(this);

  constructor(token: string) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
      ]
    });

    handleEvents(this);

    this.login(token);
  }
}
