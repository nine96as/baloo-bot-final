"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = require("path");
const logger_1 = __importDefault(require("../functions/logger"));
const getFiles_1 = __importDefault(require("../functions/getFiles"));
var AsciiTable = require('ascii-table');
const table = new AsciiTable().setHeading('button', 'status');
exports.default = () => {
    const collection = new discord_js_1.Collection();
    const files = (0, getFiles_1.default)((0, path_1.join)(__dirname, '../../interactions/components/buttons'));
    files.forEach((filePath) => {
        const button = require(filePath).default;
        if (button === undefined || button.data === undefined) {
            logger_1.default.error(`file at path ${filePath} seems to be incorrectly be exporting a button.`);
        }
        else {
            collection.set(button.name, button);
            table.addRow(button.name, 'on');
        }
    });
    logger_1.default.info(`\n${table.toString()}`);
    return collection;
};
