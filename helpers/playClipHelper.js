module.exports = {
	name: 'playClip',
	description: 'Loads an mp3 file and plays it',
	execute(receivedMessage, arguments, client, primaryCommand) {
        receivedMessage.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);

        const fs = require('fs');

        variables = client.variables
        //check if user is in voice channel
        if(!receivedMessage.member.voice.channel){
            receivedMessage.channel.send("You must be in a voice channel")
            return
        }
        //attempt to join the voice channel
        if(client.voice.connections.filter(connection => connection.channel.id === receivedMessage.member.voice.channel.id).array().length === 0) receivedMessage.member.voice.channel.join().then(function(connection){
            //create dispatcher from mp3 file
            const dispatcher = connection.play(fs.createReadStream("src/clips/" + primaryCommand + ".mp3"))
            variables.set("dispatcher" + receivedMessage.guild.id, dispatcher)

            //check if server already has a queue
            if(variables.has("songQueue" + receivedMessage.guild.id)){
                songQueue = variables.get("songQueue" + receivedMessage.guild.id)
            //if no queue create one
            }else{
                variables.set("songQueue" + receivedMessage.guild.id, [])
                songQueue = variables.get("songQueue" + receivedMessage.guild.id)
            }
            dispatcher.on("finish", () =>{
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