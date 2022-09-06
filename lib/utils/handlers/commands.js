"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const logger_1 = __importDefault(require("../functions/logger"));
const getFiles_1 = __importDefault(require("../functions/getFiles"));
var AsciiTable = require('ascii-table');
const { clientId, developerGuildId, token } = process.env;
const table = new AsciiTable().setHeading('command', 'status');
let commandsArray = [];
let developerArray = [];
exports.default = () => {
    const collection = new discord_js_1.Collection();
    const files = (0, getFiles_1.default)((0, path_1.join)(__dirname, '../../interactions/commands'));
    files.forEach((filePath) => {
        const command = require(filePath).default;
        if (command === undefined || command.data === undefined) {
            logger_1.default.error(`file at path ${filePath} seems to incorrectly be exporting a command.`);
        }
        else {
            collection.set(command.data.name, command);
            if (command.developer) {
                developerArray.push(command.data);
            }
            else {
                commandsArray.push(command.data);
            }
            table.addRow(command.data.name, 'on');
        }
    });
    const rest = new discord_js_1.REST({ version: '10' }).setToken(token);
    //loading of developer guild commands
    rest.put(discord_js_1.Routes.applicationGuildCommands(clientId, developerGuildId), { body: developerArray });
    //loading of global commands
    rest.put(discord_js_1.Routes.applicationCommands(clientId), {
        body: commandsArray,
    });
    logger_1.default.info(`\n${table.toString()}`);
    return collection;
};
