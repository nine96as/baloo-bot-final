import { Collection } from "discord.js";
import { join } from "path";
import logger from "../functions/logger";
import getFiles from "../functions/getFiles";
import Modal from "../../structures/modal";
var AsciiTable = require('ascii-table');

const table = new AsciiTable().setHeading('modal', 'status')

export default () : Collection<string, Modal> => {
    const collection: Collection<string, Modal> = new Collection();
    const files = getFiles(join(__dirname, '../../interactions/components/modals'))

    files.forEach((filePath) => {
        const modal: Modal = require(filePath).default;
        if (modal === undefined || modal.data === undefined) {
            logger.error(`file at path ${filePath} seems to incorrectly be exporting a modal.`)
        } else {
            collection.set(modal.name.toString(), modal);
            table.addRow(modal.name, 'on')
        }
    });

    logger.info(`\n${table.toString()}`);

    return collection;
}