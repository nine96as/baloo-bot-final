import { CommandInteraction, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import Bot from "./bot";

export default abstract class Command {
    developer?: boolean;
    data: RESTPostAPIApplicationCommandsJSONBody;

    constructor(data: RESTPostAPIApplicationCommandsJSONBody) {
        this.data = data;
    }

    public abstract execute(interaction: CommandInteraction, client: Bot): any;
}
