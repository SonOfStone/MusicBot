module.exports = {
	name: 'playing',
	description: 'Displays the current song playing',
	execute(receivedMessage, arguments, client) {
        variables = client.variables
        lastSong = variables.get("lastSong" + receivedMessage.guild.id)
        console.log(lastSong)
        
        if(lastSong !== undefined){
            client.helpers.get("getVideoInfo").execute(lastSong, receivedMessage, client)
        }else{
            receivedMessage.channel.send("No song is currently playing")
        }
	},
};