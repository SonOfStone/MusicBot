module.exports = {
	name: 'play',
	description: 'Plays a linked song',
    execute: async function (connection, receivedMessage, client) {
        execute(connection, receivedMessage, client)
    }
};

async function execute(connection, receivedMessage, client) {
    //simplifying calls
    variables = client.variables
    helpers = client.helpers
    
    //define songQueue
    songQueue = variables.get("songQueue" + receivedMessage.guild.id)
    const ytdl = require('ytdl-core')
    
    const streamOptions = { seek: 0, volume: false, quality: "highestaudio", bitrate: 1000}
    const stream = ytdl(songQueue[0], {filter: "audio", highWaterMark: 1<<25})
    broadcast = client.createVoiceBroadcast()
    
    variables.set("broadcast" + receivedMessage.guild.id, broadcast)
    broadcast.playStream(stream, streamOptions)
    const dispatcher = connection.playBroadcast(broadcast)
    variables.set("dispatcher" + receivedMessage.guild.id, dispatcher)
    
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
        }else if(autoPlayFlag == "random"){
            //call randomsong
            console.log("finding a random song");
            client.commands.get("randomsong").execute(receivedMessage, [], client);
        }
    }
    broadcast.on("end", () =>{
        //this marks the end of a song
        broadcast.destroy()
    })
    //testing purposes
    broadcast.on("warn", () =>{
        console.log("warning in broadcast")
    })
    broadcast.on("error", async(error) =>{
        console.log("Broadcast received an error")
        if(error.toString() == "Error: Status code: 403"){
            console.log("this is in a 403 conditional")
            //var sleep = require('sleep');
            await sleep(1000)
            songQueue.unshift(lastSong)
            helpers.get("play").execute(connection, receivedMessage, client)
        }
        console.log(error)
    })
    dispatcher.on("end", () =>{
        //this marks the end of all the songs
        songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        if(songQueue[0]){
            helpers.get("play").execute(connection, receivedMessage, client)
        }else{
            lastSongs = []
            variables.set("lastSongs" + receivedMessage.guild.id, lastSongs)
            //delete the broadcast variable when dispatcher finally ends
            variables.delete("broadcast" + receivedMessage.guild.id)
            variables.delete("dispatcher" + receivedMessage.guild.id)
            connection.disconnect();
        }
    })
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}