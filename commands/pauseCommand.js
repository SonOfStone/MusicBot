module.exports = {
	name: 'pause',
	description: 'Pauses the current song',
	execute(receivedMessage, arguments, client) {
        dispatcher = client.variables.get("dispatcher" + receivedMessage.guild.id)
        if(dispatcher)dispatcher.pause()
	},
};