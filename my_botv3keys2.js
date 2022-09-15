// WANT TO IMPLEMENT:
//timer to see song progress
//add games
//add afk handler
//perfect back command-write dispatcher.end() in a handler
//handle queue async requests better

//initialize bot
const fs = require("fs")
const Discord = require("discord.js")
const { Client, Collection, GatewayIntentBits, Partials} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions], partials: [Partials.Message , Partials.Channel , Partials.Reaction] });

//create collection of commands and variables
client.commands = new Collection();
client.variables = new Collection();
client.helpers = new Collection();

const { Client_ID, Client_secret, Api_key, discord_bot_token, prefix, rouletteChannel, giphy_key, pandora_user, pandora_pass, youtubeIdentityToken, youtubeCookie } = require('./keys2.json');
const scores = require("./src/scores.json")

client.variables.set("Client_ID", Client_ID)
client.variables.set("Client_secret", Client_secret)
client.variables.set("Api_key", Api_key)
client.variables.set("discord_bot_token", discord_bot_token)
client.variables.set("prefix", prefix)
client.variables.set("rouletteChannel", rouletteChannel)
client.variables.set("giphy_key", giphy_key)
client.variables.set("pandora_user", pandora_user)
client.variables.set("pandora_pass", pandora_pass)
client.variables.set("youtubeIdentityToken", youtubeIdentityToken)
client.variables.set("youtubeCookie", youtubeCookie)
client.variables.set("scores", scores)

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const helperFiles = fs.readdirSync("./helpers").filter(file => file.endsWith(".js"));
const clipFiles = fs.readdirSync("./src/clips").filter(file => file.endsWith(".mp3"));

//loop through all files and add them to the commands collection
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//loop through all helper files and add them to the helper collection
for (const file of helperFiles) {
	const helper = require(`./helpers/${file}`);
	client.helpers.set(helper.name, helper);
}

//loop through all mp3 files and add them to the commands with the playClip helper
for (const file of clipFiles) {
    fileName = file.substring(0, file.length-4)
    client.commands.set(fileName, client.helpers.get("playClip"))
}

client.on("ready", () => {
	client.user.setActivity("Cyberpunk 2088");
	console.log("I am ready!");
})

client.on("messageCreate", receivedMessage => {
	if (receivedMessage.author == client.user){
		// prevent bot from responding to itself
		return
	}
	if (receivedMessage.content.startsWith(prefix)){
		processCommand(receivedMessage)
	}

	//do the 2% check to change the nickname of the user
	var number = Math.floor(Math.random() * 100)
	if(number <= 2){
		client.commands.get("nick").execute(receivedMessage, arguments, client)
	}
})

client.on("error", console.error);

//function to process incoming command
function processCommand(receivedMessage){
	// remove leading "!!!"
	let fullCommand = receivedMessage.content.substr(prefix.length)
	// split command into parts
	let splitCommand = fullCommand.split(" ")
	// grab main command
	let primaryCommand = splitCommand[0].toLowerCase()
	// grab remaining arguments
	let arguments = splitCommand.slice(1)
	
	console.log("Command received: " + primaryCommand)
	console.log("Arguments: " + arguments + "\n")
	
    if (!client.commands.has(primaryCommand)) return;
    try {
        client.commands.get(primaryCommand).execute(receivedMessage, arguments, client, primaryCommand);
    } catch (error) {
        console.error(error);
        receivedMessage.reply('there was an error trying to execute that command!');
    }
}

client.login(discord_bot_token)