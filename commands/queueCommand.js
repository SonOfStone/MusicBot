module.exports = {
	name: 'queue',
	description: 'Displays songs in the queue',
	execute(receivedMessage, arguments, client) {
        helpers = client.helpers
        variables = client.variables
        
        songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        
        for(var i = 0; i < songQueue.length; i++){
            helpers.get("getVideoInfo").execute(songQueue[i], receivedMessage, client, "Queued ")
        }
        if(songQueue.length == 0){
            outputStr = "No songs in queue."
            receivedMessage.channel.send(outputStr)
        }
	},
};