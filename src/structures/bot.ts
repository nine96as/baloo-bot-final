import { Client, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import handleCommands from '../utils/handlers/commands';
import handleEvents from '../utils/handlers/events';
import handleButtons from '../utils/handlers/buttons';
import handleMenus from '../utils/handlers/menus';
import handleModals from '../utils/handlers/modals';

export default class Bot extends Client {
  commands = handleCommands();
  buttons = handleButtons();
  menus = handleMenus();
  modals = handleModals();
  player = new Player(this, {
    ytdlOptions: {
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    }
  });

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
