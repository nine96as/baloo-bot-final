"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
/**
 * returns all '.ts' or '.js' files in a path
 * @param {string} path path to search
 */
exports.default = (path) => {
    const results = fs_1.default.readdirSync(path);
    const files = pushFiles(path, results);
    return files;
};
const pushFiles = (path, results) => {
    const files = [];
    results.forEach((result) => {
        const filePath = (0, path_1.join)(path, result);
        if (isFile(filePath) && (result.endsWith('.ts') || result.endsWith('.js'))) {
            files.push(filePath);
        }
        else {
            files.push(...pushFiles(filePath, fs_1.default.readdirSync(filePath)));
        }
    });
    return files;
};
const isFile = (path) => fs_1.default.lstatSync(path).isFile();
