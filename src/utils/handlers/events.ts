import { join } from "path";
import logger from "../functions/logger";
import getFiles from "../functions/getFiles";
import Bot from '../../structures/bot';
import Event from "../../structures/event";
var AsciiTable = require('ascii-table');

const table = new AsciiTable().setHeading('event', 'status')

export default (client: Bot) => {
    const files = getFiles(join(__dirname, '../../events'));

    files.forEach((filePath) => {
        const eventClass = require(filePath).default;
        const event: Event = new eventClass(client);

        // @ts-ignore
        client[event.once ? 'once' : 'on'](event.name, event.execute);
        table.addRow(event.name, 'on');
    });

    logger.info(`\n${table.toString()}`);
}