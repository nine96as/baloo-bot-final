"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = __importDefault(require("../../../structures/command"));
class Ping extends command_1.default {
    constructor() {
        super(new discord_js_1.SlashCommandBuilder()
            .setName('ping')
            .setDescription('🏓 sends a ping request!')
            .toJSON());
        this.developer = true;
    }
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield interaction.reply({
                content: '🏓 | pong!',
                fetchReply: true,
            });
            yield interaction.editReply(`🏓 | pong! \`${msg.createdTimestamp - interaction.createdTimestamp}ms\``);
        });
    }
}
exports.default = new Ping();
