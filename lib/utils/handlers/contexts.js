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
require("dotenv/config");
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const logger_1 = __importDefault(require("../functions/logger"));
const getFiles_1 = __importDefault(require("../functions/getFiles"));
const { clientId, developerGuildId, token } = process.env;
let contextsArray = [];
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const collection = new discord_js_1.Collection();
    const files = (0, getFiles_1.default)((0, path_1.join)(__dirname, '../../interactions/contexts'));
    files.forEach((filePath) => {
        const context = require(filePath).default;
        if (context === undefined || context.data === undefined) {
            console.error(`file at path ${filePath} seems to incorrectly be exporting a context menu.`);
        }
        else {
            collection.set(context.data.name.toString(), context);
            contextsArray.push(context.data);
        }
    });
    const rest = new discord_js_1.REST({ version: '10' }).setToken(token);
    yield rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, developerGuildId), { body: contextsArray });
    logger_1.default.info('loaded context menus.');
    return collection;
});
