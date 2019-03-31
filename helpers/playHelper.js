module.exports = {
	name: 'play',
	description: 'Plays a linked song',
	execute(connection, receivedMessage, client) {
        //simplifying calls
        variables = client.variables
        helpers = client.helpers
        
        //define songQueue
        songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        
        console.log("Starting play function\n")
        const ytdl = require('ytdl-core')
        const streamOptions = { seek: 0, volume: .40, quality: "highestaudio"}
        const stream = ytdl(songQueue[0], {filter: "audioonly"})
        broadcast = client.createVoiceBroadcast();
        
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
            variables.set("autoPlayFlag" + receivedMessage.guild.id, false)
            autoPlayFlag = variables.get("autoPlayFlag" + receivedMessage.guild.id)
        }
        
        lastSong = songQueue.shift();
        variables.set("lastSong" + receivedMessage.guild.id, lastSong)
        lastSongs.push(lastSong)
        variables.set("lastSongs" + receivedMessage.guild.id, lastSongs)
        
        helpers.get("getVideoInfo").execute(lastSong, receivedMessage, client)
        if(autoPlayFlag && songQueue.length==0){
            //trying to find next song
            console.log("finding next song")
            client.helpers.get("getRelatedVideo").execute(lastSong, receivedMessage, client)
        }
        broadcast.on("end", () =>{
            broadcast.destroy()
        })
        dispatcher.on("end", () =>{
            songQueue = variables.get("songQueue" + receivedMessage.guild.id)
            if(songQueue[0]){
                helpers.get("play").execute(connection, receivedMessage, client);
            }else{
                lastSong = null
                lastSongs = []
                connection.disconnect();
            }
        })
	},
};