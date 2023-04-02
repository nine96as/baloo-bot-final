import { EmbedBuilder, EmbedData } from 'discord.js';
import { loggerEmojis } from '#assets';

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
    super(loggerEmojis.success, content);
    this.setColor('#00ff80');
  }
}

export class WarnEmbed extends EmojiEmbed {
  constructor(content: string) {
    super(loggerEmojis.warn, content);
    this.setColor('#ffff80');
  }
}

export class ErrorEmbed extends EmojiEmbed {
  constructor(content: string) {
    super(loggerEmojis.error, content);
    this.setColor('#ff8080');
  }
}

export class InfoEmbed extends EmojiEmbed {
  constructor(content: string) {
    super(loggerEmojis.info, content);
    this.setColor('#ff8040');
  }
}
