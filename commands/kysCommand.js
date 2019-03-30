module.exports = {
	name: 'kys',
	description: 'Plays a short audio clip from Bo Burnham',
	execute(receivedMessage, arguments, client) {
        variables = client.variables
        //check if user is in voice channel
        if(!receivedMessage.member.voiceChannel){
            receivedMessage.channel.send("You must be in a voice channel")
            return
        }
        //attempt to join the voice channel
        if(!receivedMessage.guild.voiceConnection) receivedMessage.member.voiceChannel.join().then(function(connection){
            //create broadcast from mp3 file
            const broadcast = client.createVoiceBroadcast();
            broadcast.playFile("src/kys.mp3")
            const dispatcher = connection.playBroadcast(broadcast)
            //end the broadcast and connection when done
            broadcast.on("end", () =>{
                broadcast.destroy()
            })
            //check if server already has a queue
            if(variables.has("songQueue" + receivedMessage.guild.id)){
                songQueue = variables.get("songQueue" + receivedMessage.guild.id)
            //if no queue create one
            }else{
                variables.set("songQueue" + receivedMessage.guild.id, [])
                songQueue = variables.get("songQueue" + receivedMessage.guild.id)
            }
            dispatcher.on("end", () =>{
                if(songQueue[0]){
                    helpers.get("play").execute(connection, receivedMessage, client);
                }else{
                    lastSong = null
                    lastSongs = []
                    connection.disconnect();
                }
            })
        })
	},
};