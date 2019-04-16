module.exports = {
	name: 'back',
	description: 'Get a new recommended song',
	execute(receivedMessage, arguments, client) {
        lastSongs = client.variables.get("lastSongs" + receivedMessage.guild.id)
        console.log(lastSongs)
        if(lastSongs.length>=2){
            var backSongLink = lastSongs[lastSongs.length-2]
            //swap elements
            lastSongs[lastSongs.length-2] = lastSongs[lastSongs.length-1]
            lastSongs[lastSongs.length-1] = backSongLink
        }
        if(backSongLink != null){
            //clear bottom of songQueue and add to bottom
            songQueue = client.variables.get("songQueue" + receivedMessage.guild.id)
            
            songQueue.shift()
            songQueue.unshift(backSongLink)
            if(broadcast) broadcast.destroy()
        }else{
            receivedMessage.channel.send("No song to go back to.")
        }
	},
};