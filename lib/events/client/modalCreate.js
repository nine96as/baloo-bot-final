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
const logger_1 = __importDefault(require("../../utils/functions/logger"));
class ModalCreate {
    constructor(client) {
        this.name = discord_js_1.Events.InteractionCreate;
        this.execute = (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (interaction.isModalSubmit()) {
                // checks if modal exists in modal collection
                const modal = this.client.modals.get(interaction.customId);
                // exists early if modal doesn't exist
                if (!modal)
                    return;
                // if modal exists, tries to carry out "execute" function
                try {
                    yield interaction.deferReply({ ephemeral: true });
                    yield modal.execute(interaction, this.client);
                }
                catch (e) {
                    logger_1.default.error(e);
                    yield interaction.editReply({
                        content: '❌ | error executing this modal',
                    });
                }
            }
        });
        this.client = client;
    }
}
exports.default = ModalCreate;
