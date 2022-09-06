import { Client, GatewayIntentBits } from "discord.js";
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
    
    constructor(token: string) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
            ],
        });

        handleEvents(this);

        this.login(token);
    }
}