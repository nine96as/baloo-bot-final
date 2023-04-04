import { EmbedBuilder, EmbedData } from 'discord.js';
import { loggerEmojis } from '#assets';

/**
 * Custom Embed class that extends EmbedBuilder
 */
export class Embed extends EmbedBuilder {
  constructor(data?: EmbedData) {
    if (!data) data = { color: 0x2f3136 };
    if (!data.color) data.color = 0x2f3136;
    super(data);
  }

  // Custom method to add a single field to the embed
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

/**
 * Custom EmojiEmbed class that extends the custom Embed class
 */
export class EmojiEmbed extends Embed {
  constructor(emoji: string, content: string) {
    // Sets the embed's description to include the given emoji and content
    super({
      description: `${emoji} ${content}`
    });
  }
}

/**
 * Custom SuccessEmbed class that extends the custom EmojiEmbed class
 */
export class SuccessEmbed extends EmojiEmbed {
  constructor(content: string) {
    // Calls the constructor of the parent class with the success emoji and content
    super(loggerEmojis.success, content);
    // Sets the embed color to green
    this.setColor('#00ff80');
  }
}

/**
 * Custom WarnEmbed class that extends the custom EmojiEmbed class
 */
export class WarnEmbed extends EmojiEmbed {
  constructor(content: string) {
    // Calls the constructor of the parent class with the warning emoji and content
    super(loggerEmojis.warn, content);
    // Sets the embed color to yellow
    this.setColor('#ffff80');
  }
}

/**
 * Custom ErrorEmbed class that extends the custom EmojiEmbed class
 */
export class ErrorEmbed extends EmojiEmbed {
  constructor(content: string) {
    // Calls the constructor of the parent class with the error emoji and content
    super(loggerEmojis.error, content);
    // Sets the embed color to red
    this.setColor('#ff8080');
  }
}

/**
 * Custom InfoEmbed class that extends the custom EmojiEmbed class
 */
export class InfoEmbed extends EmojiEmbed {
  constructor(content: string) {
    // Calls the constructor of the parent class with the info emoji and content
    super(loggerEmojis.info, content);
    // Sets the embed color to orange
    this.setColor('#ff8040');
  }
}
