module.exports = {
	name: 'playClip',
	description: 'Loads an mp3 file and plays it',
	execute(receivedMessage, arguments, client, primaryCommand) {
        receivedMessage.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);

        const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');
        const { createReadStream } = require('node:fs');

        variables = client.variables
        helpers = client.helpers
        commands = client.commands

        //check if user is in voice channel
        if(!receivedMessage.member.voice.channel){
            receivedMessage.channel.send("You must be in a voice channel")
            return
        }
        //attempt to join the voice channel
        helpers.get("player").execute(receivedMessage, client)
        let resource = createAudioResource(createReadStream("src/clips/" + primaryCommand + ".mp3"), {
            inlineVolume : true
        });
    
        const player = variables.get("player" + receivedMessage.guild.id)
        player.play(resource);

        //check if server already has a queue
        if(variables.has("songQueue" + receivedMessage.guild.id)){
            songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        //if no queue create one
        }else{
            variables.set("songQueue" + receivedMessage.guild.id, [])
            songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        }
        player.on("idle", () =>{
            if(songQueue[0]){
                helpers.get("play").execute(connection, receivedMessage, client);
            }else{
                lastSong = null
                lastSongs = []
                commands.get("stop").execute(receivedMessage, [], client)
            }
        })
	},
};