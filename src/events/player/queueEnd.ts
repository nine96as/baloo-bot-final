import { EmbedBuilder, Message } from "discord.js";
import Bot from "../../structures/bot";
import Event, { CustomEvents } from "../../structures/event";

export default class QueueEnd implements Event {
    client: Bot;
    name = CustomEvents.QueueEnd;
    once = true;

    constructor(client: Bot) {
        this.client = client;
    }

    execute = async (queue: { metadata: { channel: { send: (arg0: string) => Promise<Message<boolean>>; }; }; }) => {
        // const embed = new EmbedBuilder()
        // .setColor('Random')
        // .setTitle('🎶 | queue end')
        // .setDescription('the queue has ended, leaving...');

        queue.metadata.channel
            .send('🎶 | the queue has ended, leaving...')
            .then((msg) => {
                setTimeout(() => msg.delete(), 5000);
            });
    }
}