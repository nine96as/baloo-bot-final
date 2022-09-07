import { SelectMenuInteraction, SelectMenuBuilder } from 'discord.js';
import Bot from './bot';

export default abstract class SelectMenu {
  data: SelectMenuBuilder;
  name: string;

  constructor(name: string, data: SelectMenuBuilder) {
    this.data = data;
    this.name = name;
  }

  public abstract execute(interaction: SelectMenuInteraction, client: Bot): any;
}
