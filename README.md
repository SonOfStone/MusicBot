# MusicBot

A discord bot that takes in youtube links and plays them along with various other functionalities for discord.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You'll need to install:

Node.js 6.0.0 or newer

Python 2.7 for node-opus or python 3 for opusscript

node-opus is preferable

### Installing

#### Step 1: Install Dependencies

Several node packages:

- discord.js
- node-opus or opusscript
- ytdl-core
- xmlhttprequest

```
npm install discord.js node-opus
or
npm install discord.js opusscript
npm install ytdl-core
npm install xmlhttprequest

```
#### Step 2: Get Discord bot token
Follow the discord.js guide [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) on creating the bot

#### Step 3: Add bot to Discord Server
Follow the discord.js guide [here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html) on adding the bot to a server

#### Step 4: Grab Google API keys to get video information

You need a Google Account to access the Google API Console, request an API key, and register your application.

1. Go to https://console.developers.google.com
2. Create a project in the Google Developers Console and obtain authorization credentials so your application can submit API requests.
3. After creating your project, make sure the YouTube Data API is one of the services that your application is registered to use:
4. Go to the API Console and select the project that you just registered.
Visit the Enabled APIs page. In the list of APIs, make sure the status is ON for the YouTube Data API v3.

#### Step 5: Put all keys in keys.txt
After you put all your API keys into your keys.txt it should look something like this:

```
Client_ID:27836237326-aksdj10ajadfkfljaa823jksdjfkfljf.apps.googleusercontent.com
Client_secret:lskjdaj-TalsajdkaTJveeee
Api_key:alksj2823971VIasdjkaIEasdjfksajfkfjaks3
discord_bot_token:JDKFJkaziakalszDDKDJzlzz.EIKnsa.eioapPODIakljsdiUEH1Iksja20
```

## Deployment

1. Create a console in the same directory as my_botv3.js

2. Execute the command 

```
node my_botv3.js
```

The bot should then come online in the Discord server you added it to and can be interacted with.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details

