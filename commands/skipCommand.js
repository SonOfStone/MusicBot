module.exports = {
	name: 'skip',
	description: 'Skips the current song',
	execute(receivedMessage, arguments, client) {
        dispatcher = client.variables.get("dispatcher" + receivedMessage.guild.id)
        if(dispatcher)dispatcher.end()
	},
};