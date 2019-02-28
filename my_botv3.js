// NEED TO IMPLEMENT:
//make bot not global

// WANT TO IMPLEMENT:
//timer to see song progress
//add games
//add afk handler
//perfect back command-write broadcast.destroy() in a handler
//handle queue async requests better

//initialize bot
const Discord = require('discord.js')
const client = new Discord.Client()

var servers = {}
//Queue of songs
var songQueue = []
//api keys
var keys = {}
//autoplay flag
var autoPlayFlag = false
var lastSong = null
var songQueueIds = {}
var prefix = ";"
var broadcast = null
var lastSongs = []
var lastCommandUsage = 0
var scores = null


client.on("ready", () => {
	client.user.setActivity("BOPS! | ;help");
	console.log('I am ready!');
})

client.on("message", (receivedMessage) => {
	if (receivedMessage.author == client.user){
		// prevent bot from responding to itself
		return
	}
	if (receivedMessage.content.startsWith(prefix)){
		processCommand(receivedMessage)
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
	
	if(arguments.length > 0 && arguments[0]=="help"){
		helpCommand([primaryCommand], receivedMessage)
	}
	
	// redirect commands to other functions
	else if(primaryCommand == "help"){
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
	}else if(primaryCommand == "queue"){
		queueCommand(arguments, receivedMessage)
	}else if(primaryCommand == "playing"){
		playingCommand(arguments, receivedMessage)
	}else if(primaryCommand == "back"){
		backCommand(arguments, receivedMessage)
	}else if(primaryCommand == "playnext"){
		playNextCommand(arguments, receivedMessage)
    }else if(primaryCommand == "roulette"){
        rouletteCommand(arguments, receivedMessage)
    //misspelled roulette command
    }else if(/^roul/.test(primaryCommand)){
        typoRouletteCommand(arguments, receivedMessage)
    }else{
		receivedMessage.channel.send("Unknown Command")
	}
}

//help command function
function helpCommand(arguments, receivedMessage){
	if(arguments.length > 0){
		if(arguments[0] == "play"){
			receivedMessage.channel.send("Play adds a song to the queue must be supplied with a link\nPlay usage: '" + prefix + "play https://www.youtube.com/watch?v=O7y9aMIJG00'")
		}else if(arguments[0] == "pause"){
			receivedMessage.channel.send("Pause freezes the song currently playing\nPause usage: '" + prefix + "pause'")
		}else if(arguments[0] == "resume"){
			receivedMessage.channel.send("Resume unpauses the song if paused\nResume usage: '" + prefix + "resume'")
		}else if(arguments[0] == "skip"){
			receivedMessage.channel.send("Skip plays the next song in queue\nSkip usage: '" + prefix + "skip'")
		}else if(arguments[0] == "stop"){
			receivedMessage.channel.send("Stop makes the bot leave the channel and empty the queue\nStop usage: '" + prefix + "stop'")
		}else if(arguments[0] == "autoplay"){
			receivedMessage.channel.send("Autoplay plays related songs to the previous song. If supplied with no arguments Autoplay is toggled. If given a link it will play that song.\nAutoplay usage: '" + prefix + "autoplay https://www.youtube.com/watch?v=O7y9aMIJG00'\nor '" + prefix + "autoplay'")
		}else if(arguments[0] == "queue"){
			receivedMessage.channel.send("Queue lists all the songs in the queue.\nQueue usage: '" + prefix + "queue'")
		}else if(arguments[0] == "playing"){
			receivedMessage.channel.send("Playing displays the song currently playing.\nPlaying usage: '" + prefix + "playing'")
		}else if(arguments[0] == "back"){
			receivedMessage.channel.send("Back replays the previous song and also gives a new suggestion in Autoplay\nQueue usage: '" + prefix + "back'")
		}else if(arguments[0] == "playnext"){
			receivedMessage.channel.send("Puts song next in the queue, must be given a link\nQueue usage: '" + prefix + "playnext https://www.youtube.com/watch?v=O7y9aMIJG00'")
        }else if(arguments[0] == "roulette"){
            receivedMessage.channel.send("Moves a random person in your voice channel to the afk channel\nQueue usage: '" + prefix + "roulette'")
		}
	}else if(arguments.length == 0){
		receivedMessage.channel.send(prefix + "help, " + prefix + "play, " + prefix + "pause, " + prefix + "resume, " + prefix + "skip, " + prefix + "stop, " + prefix + "autoplay, " + prefix + "queue, "  + prefix + "playing, "  + prefix + "back, "  + prefix + "playnext, " + prefix + "roulette\nOr type in '" + prefix + "help <command>' for info on that command")
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
	//check if link is good
	var youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
	if(arguments[0].match(youtubeRegex)){
		console.log("pushing " + arguments[0])
		songQueue.push(arguments[0])
		var videoId = arguments[0].split("?v=")[1]
		songQueueIds[videoId] = arguments[0]
		//display queue if bigger than 1
		if(songQueue.length > 1)queueCommand(arguments, receivedMessage)
		if(!receivedMessage.guild.voiceConnection) receivedMessage.member.voiceChannel.join().then(function(connection){
			play(connection, receivedMessage)
		})
		.catch(console.error)
	}else{
		receivedMessage.channel.send("Could not find a video with your link")
	}
}

function play(connection, receivedMessage){
	console.log("Starting play function\n")
	const ytdl = require('ytdl-core')
	const streamOptions = { seek: 0, volume: .40, quality: "highestaudio"}
	const stream = ytdl(songQueue[0], {filter: "audioonly"})
	broadcast = client.createVoiceBroadcast();
	broadcast.playStream(stream, streamOptions)
	const dispatcher = connection.playBroadcast(broadcast)
	lastSong = songQueue.shift();
	lastSongs.push(lastSong)
	getVideoInfo(lastSong, receivedMessage)
	if(autoPlayFlag && songQueue.length==0){
		//trying to find next song
		console.log("finding next song")
		autoPlay(lastSong, receivedMessage)
	}
	broadcast.on("end", () =>{
		broadcast.destroy()
	})
	dispatcher.on("end", () =>{
		if(songQueue[0]){
			play(connection, receivedMessage);
		}else{
			lastSong = null
			lastSongs = []
			connection.disconnect();
		}
	})
}

//pauses current music
function pauseCommand(arguments, receivedMessage){
	if(broadcast)broadcast.pause()
}

//resumes current music
function resumeCommand(arguments, receivedMessage){
	if(broadcast)broadcast.resume()
}

//skips current song
function skipCommand(arguments, receivedMessage){
	if(broadcast)broadcast.destroy()
}

//ends entire queue
function stopCommand(arguments, receivedMessage){
	if(arguments.length == 0){
		songQueueIds = {}
		songQueue = []
		autoPlayFlag = false
		if(broadcast)broadcast.destroy()
	}else if(arguments[0] = "autoplay"){
		songQueueIds = {}
		autoPlayFlag = false
	}
}

//plays related song
function autoPlayCommand(arguments, receivedMessage){
	if(arguments.length==1){
		playCommand(arguments, receivedMessage)
		autoPlayFlag = true
	}else if(arguments.length==0){
		autoPlayFlag = !autoPlayFlag
		if(autoPlayFlag){
			receivedMessage.channel.send("Autoplay is on.")
			if(autoPlayFlag && songQueue.length == 0 && lastSong != null){
				console.log(lastSong)
				//trying to find next song
				console.log("finding next song")
				autoPlay(lastSong, receivedMessage)
			}
		}else{
			receivedMessage.channel.send("Autoplay is off.")
		}
		
	}
}

//displays songs in the queue
function queueCommand(arguments, receivedMessage){
	for(var i = 0; i < songQueue.length; i++){
		getVideoInfo(songQueue[i], receivedMessage, "Queued ")
	}
	if(songQueue.length == 0){
		outputStr = "No songs in queue."
		receivedMessage.channel.send(outputStr)
	}
}

//displays the info for song currently playing
function playingCommand(arguments, receivedMessage){
	if(lastSong != null){
		getVideoInfo(lastSong, receivedMessage)
	}else{
		receivedMessage.channel.send("No song is currently playing")
	}
}

//function to reset youtube suggestion
function backCommand(arguments, receivedMessage){
	console.log(lastSongs)
	if(lastSongs.length>=2){
		var backSongLink = lastSongs[lastSongs.length-2]
		//swap elements
		lastSongs[lastSongs.length-2] = lastSongs[lastSongs.length-1]
		lastSongs[lastSongs.length-1] = backSongLink
	}
	if(backSongLink != null){
		//clear bottom of songQueue and add to bottom
		songQueue.shift()
		songQueue.unshift(backSongLink)
		if(broadcast) broadcast.destroy()
	}else{
		receivedMessage.channel.send("No song to go back to.")
	}
	// I want to uncomment this but doesnt seem to work
	// if(broadcast) broadcast.destroy()
}

//function to add song next in queue
function playNextCommand(arguments, receivedMessage){
	if(arguments.length != 1){
		receivedMessage.channel.send("Please provide a link")
		return
	}
	if(!receivedMessage.member.voiceChannel){
		receivedMessage.channel.send("You must be in a voice channel")
		return
	}
	//check if link is good
	var youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
	if(arguments[0].match(youtubeRegex)){
		console.log("pushing " + arguments[0])
		songQueue.unshift(arguments[0])
		var videoId = arguments[0].split("?v=")[1]
		songQueueIds[videoId] = arguments[0]
		//display queue if bigger than 1
		if(songQueue.length > 1)queueCommand(arguments, receivedMessage)
		if(!receivedMessage.guild.voiceConnection) receivedMessage.member.voiceChannel.join().then(function(connection){
			play(connection, receivedMessage)
		})
		.catch(console.error)
	}else{
		receivedMessage.channel.send("Could not find a video with your link")
	}
}

//function to move random player to afk channel
function rouletteCommand(arguments, receivedMessage){
    const now = new Date();
    //cooldown in seconds
    if (now - lastCommandUsage > 5 * 1000) {
        const voiceChannel = receivedMessage.member.voiceChannel
        if(voiceChannel !== undefined){
            var members = voiceChannel.members
            var randomMember = members.random()
            incrementScore(randomMember)
            //this is the afk channel in New PLebs Onlay
            randomMember.setVoiceChannel('383383758679703575')
                .then(() => console.log(`Moved ${randomMember.displayName}`))
                .catch(console.error);
            var personal_score = getScore(randomMember)
            receivedMessage.channel.send(`${randomMember.toString()} has lost the roulette ${personal_score} times!`)
            lastCommandUsage = now
        }else{
            receivedMessage.channel.send("You are not in a voice channel")
        }
    }else{
        receivedMessage.channel.send("The roulette command is on cooldown")
    }
}

function typoRouletteCommand(arguments, receivedMessage){
    //move user to afk channel
    const voiceChannel = receivedMessage.member.voiceChannel
    if(voiceChannel !== undefined){
        incrementScore(receivedMessage.member)
        receivedMessage.member.setVoiceChannel('383383758679703575')
            .then(() => console.log(`Moved ${receivedMessage.member.displayName}`))
            .catch(console.error);
        var personal_score = getScore(receivedMessage.member)
        receivedMessage.channel.send(`${receivedMessage.member.toString()} has lost the roulette!`)
    }else{
         receivedMessage.channel.send("You are not in a voice channel")
    }
}


//////////////////////////HELPER FUNCTIONS///////////////////////////////

//imports the scores from json at start
function importScore(){
    scores = require("./src/scores.json")
}

//add 1 to score of user
function incrementScore(member){
    var oldScore = scores[member.id]
    if(oldScore !== undefined){
        scores[member.id] = oldScore + 1
    }else{
        scores[member.id] = 1
    }
    var fs = require("fs")
    //write new scores to file
    fs.writeFile("src/scores.json", JSON.stringify(scores), function(err){
        if(err) throw err
        console.log("complete")
        }
    );
}

//retrieves the score of a member for roulette
function getScore(member){
    return scores[member.id]
}

//calls api to get related video
function autoPlay(videoUrl, receivedMessage){
	autoPlayFlag = true
	var videoId = videoUrl.split("?v=")[1]
	var apiUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=" + videoId + "&type=video&key=" + keys["Api_key"]
	var apiCallResponse = httpGetAsync(apiUrl, autoPlayHandler, receivedMessage)
}

//calls api to get video info
function getVideoInfo(videoUrl, receivedMessage, outputStartText){
	var youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
	var videoId = videoUrl.split("?v=")[1]
	if(videoUrl.match(youtubeRegex)){
		var apiUrl = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&fields=items(id,snippet(title,description),contentDetails)&part=snippet,contentDetails&key=" + keys["Api_key"]
		var apiCallResponse = httpGetAsync(apiUrl, getVideoInfoHandler, receivedMessage, outputStartText)
	}else{
		receivedMessage.channel.send("Could not find a video.")
	}
}

//takes in youtube api output for video title and length
function getVideoInfoHandler(response, receivedMessage, outputStartText){
	var json = JSON.parse(response)
	var title = json["items"][0]["snippet"]["title"]
	var titleCharLimit = 45
	var url = "https://www.youtube.com/watch?v=" + json["items"][0]["id"]
	if(title.length > titleCharLimit){
		title = title.substr(0, titleCharLimit)
		title += "..."
		title = title.replace("[", "")
		title = title.replace("]", "")
	}
	title = "[" + title + "]" + "(https://www.youtube.com/watch?v=" + json["items"][0]["id"] + ")"
	
	var duration = json["items"][0]["contentDetails"]["duration"]
	duration = convertTime(duration)
	
	var description = json["items"][0]["snippet"]["description"]
	var charLimit = 150
	description = description.substr(0,charLimit)+"..."
	//I did not want description at this time so empty string
	description = ""
	
	if(outputStartText==null) var outputStartText = "Playing "
	var outputStr = outputStartText + title + "   " + duration + "\n" + description
	const embed = new Discord.RichEmbed()
		.setColor(0xFF0000)
		.setDescription(outputStr)
	receivedMessage.channel.send(embed)
}

//function to turn youtube api time into better format
function convertTime(inputStr){
	var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
	var hours = 0, minutes = 0, seconds = 0, totalseconds;

	if (reptms.test(inputStr)) {
		var matches = reptms.exec(inputStr);
		if (matches[1]) hours = Number(matches[1]);
		if (matches[2]) minutes = Number(matches[2]);
		if (matches[3]) seconds = Number(matches[3]);
		totalseconds = hours * 3600  + minutes * 60 + seconds;
	}
	
	if(hours==0){
		return(String(minutes).padStart(2,0) + ":" + String(seconds).padStart(2,0))
	}else{
		return(String(hours).padStart(2,0) + ":" + String(minutes).padStart(2,0) + ":" + String(seconds).padStart(2,0))
	}
}

//takes in youtube api output for related songs checks for repeats
//and sends play command for next song
function autoPlayHandler(response, receivedMessage){
	var json = JSON.parse(response);
	for(var i=0; i < songQueue.length; i++){
		var videoId = songQueue[i].split("?v=")[1]
		songQueueIds[videoId] = songQueue[i]
	}
	
	var nextVideoId = ""
	var notFound = true
	var counter = 0
	while(notFound && counter <= 4){
		var nextVideoId = json["items"][counter]["id"]["videoId"]
		console.log(nextVideoId)
		console.log(songQueueIds)
		if(songQueueIds[nextVideoId] == null){
			console.log("found empty element\n\n")
			notFound = false
		}else{
			console.log("trying again \n")
		}
		counter ++
	}
	var nextUrl = "https://www.youtube.com/watch?v=" + nextVideoId
	songQueueIds[nextVideoId] = nextUrl
	console.log("WE ARE PLAYING NEXT " + nextUrl)
	songQueue.push(nextUrl)
	queueCommand(arguments, receivedMessage)
}

//get asynchronous data
function httpGetAsync(theUrl, callback, receivedMessage, outputStartText){
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
	var xmlHttp = new XMLHttpRequest()
	xmlHttp.responseType = "json"
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			// console.log("we made it")
			callback(xmlHttp.responseText, receivedMessage, outputStartText)
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
//import the scores
importScore()