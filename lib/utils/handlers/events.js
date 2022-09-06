"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const logger_1 = __importDefault(require("../functions/logger"));
const getFiles_1 = __importDefault(require("../functions/getFiles"));
var AsciiTable = require('ascii-table');
const table = new AsciiTable().setHeading('event', 'status');
exports.default = (client) => {
    const files = (0, getFiles_1.default)((0, path_1.join)(__dirname, '../../events'));
    files.forEach((filePath) => {
        const eventClass = require(filePath).default;
        const event = new eventClass(client);
        // @ts-ignore
        client[event.once ? 'once' : 'on'](event.name, event.execute);
        table.addRow(event.name, 'on');
    });
    logger_1.default.info(`\n${table.toString()}`);
};
