//initialize bot
const Discord = require('discord.js')
const client = new Discord.Client()

//Queue of songs
var songQueue = []
//api keys
var keys = {}
//autoplay flag
var autoplay = false

client.on("ready", () => {
	client.user.setActivity("Online!");
	console.log('I am ready!');
})

client.on('message', (receivedMessage) => {
	if (receivedMessage.author == client.user){
		// prevent bot from responding to itself
		return
	}
	if (receivedMessage.content.startsWith("!!!")){
		processCommand(receivedMessage)
	}
})

//function to process incoming command
function processCommand(receivedMessage){
	// remove leading "!!!"
	let fullCommand = receivedMessage.content.substr(3)
	// split command into parts
	let splitCommand = fullCommand.split(" ")
	// grab main command
	let primaryCommand = splitCommand[0]
	// grab remaining arguments
	let arguments = splitCommand.slice(1)
	
	console.log("Command received: " + primaryCommand)
	console.log("Arguments: " + arguments)
	
	// redirect commands to other functions
	if(primaryCommand == "help"){
		helpCommand(arguments, receivedMessage)
	}else if(primaryCommand == "play"){
		playCommand(arguments, receivedMessage)
	}else if(primaryCommand == "pause"){
		pauseCommand(arguments, receivedMessage)
	}else if(primaryCommand == "resume"){
		resumeCommand(arguments, receivedMessage)
	}else if(primaryCommand == "skip"){
		skipCommand(arguments, receivedMessage)
	}else if(primaryCommand == "stop"){
		stopCommand(arguments, receivedMessage)
	}else if(primaryCommand == "autoplay"){
		autoPlayCommand(arguments, receivedMessage)
	}else{
		receivedMessage.channel.send("Unknown Command")
	}
}

//help command function
function helpCommand(arguments, receivedMessage){
	if(arguments.length > 0){
		receivedMessage.channel.send("It looks like you might need help with " + arguments)
	} else {
		receivedMessage.channel.send("I'm not sure what you need help with.")
	}
}

//pushes songs to queue
function playCommand(arguments, receivedMessage){
	if(arguments.length != 1){
		receivedMessage.channel.send("Please provide a link")
		return
	}
	if(!receivedMessage.member.voiceChannel){
		receivedMessage.channel.send("You must be in a voice channel")
		return
	}
	console.log("pushing " + arguments[0])
	songQueue.push(arguments[0])
	if(!receivedMessage.guild.voiceConnection) receivedMessage.member.voiceChannel.join().then(function(connection){
		play(connection, receivedMessage)
	})
	.catch(console.error)
}

function play(connection, receivedMessage){
	console.log("starting play function")
	const ytdl = require('ytdl-core')
	const streamOptions = { seek: 0, volume: .08 }
	const stream = ytdl(songQueue[0], {filter: "audioonly"})
	broadcast = client.createVoiceBroadcast();
	broadcast.playStream(stream, streamOptions)
	const dispatcher = connection.playBroadcast(broadcast)
	var lastSong = songQueue.shift();
	broadcast.on("end", () =>{
		broadcast.destroy()
		})
	dispatcher.on("end", () =>{
		if(songQueue[0]){
			play(connection, receivedMessage);
		// }else if(autoplay){
			// autoPlayCommand(lastSong)
		}else{
			connection.disconnect();
		}
	})
}

//pauses current music
function pauseCommand(arguments, receivedMessage){
	broadcast.pause()
}

//resumes current music
function resumeCommand(arguments, receivedMessage){
	broadcast.resume()
}

//skips current song
function skipCommand(arguments, receivedMessage){
	broadcast.destroy()
}

//ends entire queue
function stopCommand(arguments, receivedMessage){
	songQueue = []
	broadcast.destroy()
}

//plays related song
function autoPlayCommand(arguments, receivedMessage){
	playCommand(arguments, receivedMessage)
	var videoId = arguments[0].split("?v=")[1]
	var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=" + videoId + "&type=video&key=" + keys["Api_key"]
	var apiCallResponse = httpGetAsync(url, handleResponse, receivedMessage)
}

//takes in youtube api output and sends play command for next song
function handleResponse(response, receivedMessage){
	var json = JSON.parse(response);
	nextVideoId = json["items"][0]["id"]["videoId"]
	var nextUrl = "https://www.youtube.com/watch?v=" + nextVideoId
	var args = [nextUrl]
	playCommand(args, receivedMessage)
}

//get asynchronous data
function httpGetAsync(theUrl, callback, receivedMessage){
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
	var xmlHttp = new XMLHttpRequest()
	xmlHttp.responseType = "json"
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText, receivedMessage)
	}
	xmlHttp.open("GET", theUrl, true) // true for asynchronous 
	xmlHttp.send(null)
}

//grab keys from file
const fs = require("fs")
fs.readFile("keys.txt", "utf-8", (err, data) => {
	if(err) throw err
	lines = data.split("\n")
	for(var line = 0; line < lines.length; line++){
		splitline = lines[line].split(":")
		keys[splitline[0]]=splitline[1]
	}
	bot_secret_token = keys["discord_bot_token"]
	client.login(bot_secret_token)
})