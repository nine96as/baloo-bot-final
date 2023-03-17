import { Client, Collection } from 'discord.js';
import { DiscordTogether } from 'discord-together';
import { loadEvents, loadCommands, loadModals } from '#handlers';
import { Command } from './command.js';
import { Button } from './button.js';
import { SelectMenu } from './select.js';
import { Modal } from './modal.js';
import { intents, logger } from '#functions';

/**
 * Extends the Client class from the Discord.js library and adds additional functionality to manage commands,
 * buttons, select menus, and modals. Also creates a DiscordTogether instance to enable users to watch YouTube
 * videos together in voice channels.
 */
export class Bot extends Client {
  /**
   * Collection instance used to store `Command` instances.
   */
  commands = new Collection<string, Command>();

  /**
   * Collection instance used to store `Button` instances.
   */
  buttons = new Collection<string, Button>();

  /**
   * Collection instance used to store `SelectMenu` instances.
   */
  selects = new Collection<string, SelectMenu>();

  /**
   * Collection instance used to store `Modal` instances.
   */
  modals = new Collection<string, Modal>();

  /**
   * Attribute used to create a new DiscordTogether instance.
   */
  together = new DiscordTogether(this);

  // Constructs a new client instance with intent declarations
  constructor(token: string) {
    super({ intents: intents });
    this.init(token);
  }

  /**
   * Binds all events, commands, and components to the client instance, logs in to Discord with the provided token,
   * and catches any login errors that may occur.
   */
  async init(token: string) {
    // Promise.all used to load handlers in parallel
    await Promise.all([
      loadEvents(this),
      loadCommands(this),
      // loadButtons(this),
      // loadSelects(this),
      loadModals(this)
    ]);

    // Login to Discord
    this.login(token).catch((e) => {
      logger.error(e);
      process.exit(1);
    });
  }
}
