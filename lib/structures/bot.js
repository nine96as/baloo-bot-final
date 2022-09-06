"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commands_1 = __importDefault(require("../utils/handlers/commands"));
const events_1 = __importDefault(require("../utils/handlers/events"));
const buttons_1 = __importDefault(require("../utils/handlers/buttons"));
const menus_1 = __importDefault(require("../utils/handlers/menus"));
const modals_1 = __importDefault(require("../utils/handlers/modals"));
class Bot extends discord_js_1.Client {
    constructor(token) {
        super({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.GuildVoiceStates,
            ],
        });
        this.commands = (0, commands_1.default)();
        this.buttons = (0, buttons_1.default)();
        this.menus = (0, menus_1.default)();
        this.modals = (0, modals_1.default)();
        (0, events_1.default)(this);
        this.login(token);
    }
}
exports.default = Bot;
