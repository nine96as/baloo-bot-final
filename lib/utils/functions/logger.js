"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = require("pino");
const transport = pino_1.pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'dd-mm-yyyy HH:MM:ss',
    }
});
const logger = (0, pino_1.pino)(transport);
exports.default = logger;
