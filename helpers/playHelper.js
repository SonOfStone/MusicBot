module.exports = {
	name: 'play',
	description: 'Plays a linked song',
    execute: async function (receivedMessage, client) {
        execute(receivedMessage, client)
    }
};

async function execute(receivedMessage, client) {
    //simplifying calls
    variables = client.variables
    helpers = client.helpers
    commands = client.commands
    
    //define songQueue
    songQueue = variables.get("songQueue" + receivedMessage.guild.id)
    const ytdl = require('ytdl-core')
    const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');
    const { createReadStream } = require('node:fs');
    
    const stream = ytdl(songQueue[0], {filter: "audio", highWaterMark: 1<<62, liveBuffer: 1<<62, dlChunkSize: 0, bitrate: 128, requestOptions: {
        headers: {
            cookie: variables.get("youtubeCookie"),
            'x-youtube-identity-token': variables.get("youtubeIdentityToken")
        }
    }})

    helpers.get("player").execute(receivedMessage, client)
    let resource = createAudioResource(stream, {
        inlineVolume : true
    });

    const player = variables.get("player" + receivedMessage.guild.id)
    player.play(resource);
    
    if(variables.has("lastSongs" + receivedMessage.guild.id)){
        lastSongs = variables.get("lastSongs" + receivedMessage.guild.id)
    }else{
        variables.set("lastSongs" + receivedMessage.guild.id, [])
        lastSongs = variables.get("lastSongs" + receivedMessage.guild.id)
    }
    if(variables.has("autoPlayFlag" + receivedMessage.guild.id)){
        autoPlayFlag = variables.get("autoPlayFlag" + receivedMessage.guild.id)
    }else{
        variables.set("autoPlayFlag" + receivedMessage.guild.id, "off")
        autoPlayFlag = variables.get("autoPlayFlag" + receivedMessage.guild.id)
    }
    
    lastSong = songQueue.shift();
    variables.set("songQueue" + receivedMessage.guild.id, songQueue)
    variables.set("lastSong" + receivedMessage.guild.id, lastSong)
    lastSongs.push(lastSong)
    variables.set("lastSongs" + receivedMessage.guild.id, lastSongs)
    
    helpers.get("getVideoInfo").execute(lastSong, receivedMessage, client)
    //check if autoplay is not off and the queue is empty
    if(autoPlayFlag != "off" && songQueue.length==0){
        //check if autoplay is set to recommended
        if(autoPlayFlag == "recommended"){
            //trying to find next song
            console.log("finding next song");
            client.helpers.get("getRelatedVideo").execute(lastSong, receivedMessage, client);
        //check if autoplay is set to random
        }else if(autoPlayFlag == "random"){
            //call randomsong
            console.log("finding a random song");
            client.commands.get("randomsong").execute(receivedMessage, [], client);
        //check if autoplay is set to pandora
        }else if(autoPlayFlag == "pandora"){
            //call the pandora command
            console.log("get a song from pandora");
            client.commands.get("pandora").execute(receivedMessage, [], client);
        }
    }
    //testing purposes
    player.on("warn", () =>{
        console.log("warning in player")
    })
    player.on("error", async(error) =>{
        console.log("Player received an error")
        if(error.toString() == "Error: Status code: 403"){
            console.log("this is in a 403 conditional")
            //var sleep = require('sleep');
            await sleep(1000)
            songQueue.unshift(lastSong)
            helpers.get("play").execute(receivedMessage, client)
        }
        console.log(error)
    })
    player.on("idle", () =>{
        console.log("Player has ended")
        //this marks the end of all the songs
        songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        if(songQueue[0]){
            helpers.get("play").execute(receivedMessage, client)
        }else{
            lastSongs = []
            variables.set("lastSongs" + receivedMessage.guild.id, lastSongs)
            commands.get("stop").execute(receivedMessage, [], client)
        }
    })
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}