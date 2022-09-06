import 'dotenv/config';
import { Collection, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { join } from "path";
import logger from '../functions/logger';
import getFiles from "../functions/getFiles";
import Command from '../../structures/command';
var AsciiTable = require('ascii-table');

const { clientId, developerGuildId, token } = process.env;

const table = new AsciiTable().setHeading('command', 'status')

let commandsArray: RESTPostAPIApplicationCommandsJSONBody[] = [];
let developerArray: RESTPostAPIApplicationCommandsJSONBody[] = [];

export default () : Collection<string, Command> => {
    const collection: Collection<string, Command> = new Collection();
    const files = getFiles(join(__dirname, '../../interactions/commands'));

    files.forEach((filePath) => {
        const command: Command = require(filePath).default;
        if (command === undefined || command.data === undefined) {
            logger.error(`file at path ${filePath} seems to incorrectly be exporting a command.`)
        } else {
            collection.set(command.data.name, command);
            if (command.developer) {
                developerArray.push(command.data);
            } else {
                commandsArray.push(command.data);
            }

            table.addRow(command.data.name, 'on');
        }
    });

    const rest = new REST({ version: '10' }).setToken(token!);

    //loading of developer guild commands
    rest.put(Routes.applicationGuildCommands(clientId!, developerGuildId!), { 
        body: developerArray,
    });

    //loading of global commands
    rest.put(Routes.applicationCommands(clientId!), {
        body: commandsArray,
    });

    logger.info(`\n${table.toString()}`);

    return collection;
}


