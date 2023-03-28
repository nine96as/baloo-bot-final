# baloo-bot-final

a multi-purpose discord bot made using [discord.js](https://github.com/discordjs/discord.js)

![Alt](https://repobeats.axiom.co/api/embed/a70c458d296958fd09ea21b9069c89955ef76a4b.svg 'Repobeats analytics image')

## auto-deployment

- you will have to configure environment variables; **check configuration section below**

[![Open in Gitpod](https://camo.githubusercontent.com/76e60919474807718793857d8eb615e7a50b18b04050577e5a35c19421f260a3/68747470733a2f2f676974706f642e696f2f627574746f6e2f6f70656e2d696e2d676974706f642e737667)](https://gitpod.io/#https://github.com/nine96as/baloo-bot-final)

## features

- a dedicated welcome banner system, lockdown system, afk system, role menu system
- fully-featured chatbot system which leverages OpenAI's gpt-3.5-turbo model
- makes use of slash commands, buttons and select menus, context menus
- an array of commands; misc, moderation, reaction roles, information etc

## manual installation

### requirements

- node.js (v16.16>)
- npm

### initialisation

- create a discord bot application [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- clone the bot project using below command

```bash
git clone https://github.com/nine96as/baloo-bot-final
```

- open terminal in project directory, and enter below command

```sh
npm i #install dependencies from package.json
```

### configuration

- create a .env file in the project directory and fill in the following attribute-value combinations

| attribute     | type     | description                                                                                                   |
| :------------ | :------- | :------------------------------------------------------------------------------------------------------------ |
| `token`       | `string` | bot token ([disc dev portal](https://discord.com/developers/applications))                                    |
| `clientId`    | `string` | `APPLICATION_ID` in [disc dev portal](https://discord.com/developers/applications)                            |
| `databaseUrl` | `string` | prisma database url ([docs](https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema)) |

### deployment

- deploy bot using below command

```sh
npm run build #builds ts code into js
npm run start #runs js compiled code
```

### extras

- prettier and eslint scripts are available to automate code formatting

```sh
npm run format #prettier checks + enforces formatting
npm run lint #eslint check + auto-fix errors where possible
```

- a nodemon script is available for instant restarts upon file changes

```sh
npm run start:dev #nodemon listens for file changes
```
