<h1 align="center">baloo-bot-final</h1>

<div align="center">

A multi-purpose [**Discord**](https://discord.com) bot built with [**discord.js**](https://github.com/discordjs/discord.js), [**TypeScript**](https://www.typescriptlang.org/)

</div>

![Alt](https://repobeats.axiom.co/api/embed/a70c458d296958fd09ea21b9069c89955ef76a4b.svg 'Repobeats analytics image')

---

## Features

- A dedicated member welcoming system, moderation system, AFK (Away From Keyboard) system, role menu system
- Fully-featured chatbot system which leverages OpenAI's `gpt-3.5-turbo` model
- Makes use of Discord's new bot-user interactions: slash commands, buttons and select menus, context menus and modals

## Installation

1. Clone the repository and `cd` into it:

   ```sh
   git clone https://github.com/nine96as/baloo-bot-final
   cd baloo-bot-final
   ```

2. Install required `npm` dependencies:

   ```sh
   npm install #install dependencies from package.json
   ```

3. Complete the steps in the **Configuration** section, then run the bot with:

   ```sh
   npm run start:dev #nodemon listens for file changes
   ```

   > **Note**: The `start:dev` script will run the bot with [nodemon](https://nodemon.io), which will automatically restart the bot when changes are made to the source code.

## Configuration

The bot requires a **Discord bot token** to use the Discord API, the bot's `APPLICATION_ID` to be able to deploy commands, an **OpenAI API key** to enable the chatbot functionality, and a `DATABASE_URL` to enable Prisma to interact with a database.

1. Fetch the **Discord bot token** by creating a discord bot application, [using this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).

   > **Warning**: It is vital that you do not ever share your bot token with anybody, purposely or accidentally. If someone does manage to get a hold of your bot's token, they can use your bot as if it were theirs. If you accidentally share your token, [revoke it immediately](https://discordjs.guide/preparations/setting-up-a-bot-application.html#revoking-token-and-invite-link) and generate a new one.

2. Fetch the `APPLICATION_ID` by accessing the [Discord Developer Portal](https://discord.com/developers/applications), selecting your newly generated bot application, and looking at the **General Information** page.

3. Fetch the **OpenAI API key** [using this guide](https://www.windowscentral.com/software-apps/how-to-get-an-openai-api-key).

   > **Warning**: It is imperative that you do not ever share OpenAI API key with anybody, purposely or accidentally. If you accidentally commit your token, [revoke it immediately](https://platform.openai.com/account/api-keys) and generate a new one.

4. Fetch the `DATABASE_URL` [using this guide](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-planetscale), where [PlanetScale](https://planetscale.com/) is used as the database provider.

5. After you've acquired all the required values, create a `.env` file, and fill it in as shown below:

   ```env
   token='token'
   clientId='APPLICATION_ID'
   openAIKey='openAIApiKey'
   databaseUrl='DATABASE_URL'
   ```

### Deployment

To deploy the bot for production, run the below commands.

```sh
npm run build #builds ts code into js
npm run start #runs js compiled code
```

### Additional Scripts

- **[Prettier](https://prettier.io)** and **[ESLint](https://eslint.org)** scripts are available to automate code formatting

  ```sh
  npm run format #prettier checks + enforces formatting
  npm run lint #eslint check + auto-fix errors where possible
  ```
