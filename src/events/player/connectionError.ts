import { Message } from "discord.js";
import Bot from "../../structures/bot";
import Event, { CustomEvents } from "../../structures/event";
import logger from "../../utils/functions/logger";

export default class ConnectionError implements Event {
    client: Bot;
    name = CustomEvents.ConnectionError;
    once = true;

    constructor(client: Bot) {
        this.client = client;
    }

    execute = async (queue: { metadata: { channel: { send: (arg0: string) => Promise<Message<boolean>>; }; }; }, error: Error) => {
        logger.error(error);
        queue.metadata.channel
            .send(`❌ | error emitted from connection: ${error.message}`)
            .then((msg) => {
                setTimeout(() => msg.delete(), 5000);
            });
    }
}