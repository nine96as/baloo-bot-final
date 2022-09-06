import { Events, Message } from "discord.js";
import logger from "../../utils/functions/logger";
import Bot from "../../structures/bot";
import Event from "../../structures/event";

export default class Debug implements Event {
    client: Bot;
    name = Events.Debug;
    once = true;

    constructor(client: Bot) {
        this.client = client;
    }

    execute = async (m: Message) => {
        logger.debug(m);
    }
}