import { EmbedBuilder, EmbedData } from 'discord.js';
import emojis from '#assets/emojis';

export class Embed extends EmbedBuilder {
  constructor(data?: EmbedData) {
    if (!data) data = { color: 0x2f3136 };
    if (!data.color) data.color = 0x2f3136;
    super(data);
  }

  addField(name: string, value: string, inline?: boolean): this {
    this.addFields([
      {
        name,
        value,
        inline
      }
    ]);
    return this;
  }
}

export class EmojiEmbed extends Embed {
  constructor(emoji: string, content: string) {
    super({
      description: `${emoji} ${content}`
    });
  }
}

export class SuccessEmbed extends EmojiEmbed {
  constructor(content: string) {
    super(emojis.success, content);
    this.setColor('#2ecc71');
  }
}

export class ErrorEmbed extends EmojiEmbed {
  constructor(content: string) {
    super(emojis.error, content);
    this.setColor('#e74c3c');
  }
}

export class InfoEmbed extends EmojiEmbed {
  constructor(content: string) {
    super(emojis.info, content);
    this.setColor('#95a5a6');
  }
}
