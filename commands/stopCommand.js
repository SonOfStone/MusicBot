module.exports = {
	name: 'stop',
	description: 'Stops the currrent song and removes the queue, if supplied "autoplay" it turns autoplay off',
	execute(receivedMessage, arguments, client) {
        dispatcher = client.variables.get("dispatcher" + receivedMessage.guild.id)
        songQueue = client.variables.get("songQueue" + receivedMessage.guild.id)
        songQueueIds = client.variables.get("songQueueIds" + receivedMessage.guild.id)
        autoPlayFlag = client.variables.get("autoPlayFlag" + receivedMessage.guild.id)
        
        if(arguments.length == 0){
            client.variables.set("songQueueIds" + receivedMessage.guild.id, {})
            client.variables.set("songQueue" + receivedMessage.guild.id, [])
            client.variables.set("autoPlayFlag" + receivedMessage.guild.id, "off")
            if(dispatcher)dispatcher.end()
        }else if(arguments[0] = "autoplay"){
            client.variables.set("songQueueIds" + receivedMessage.guild.id, {})
            client.variables.set("autoPlayFlag" + receivedMessage.guild.id, "off")
        }
	},
};