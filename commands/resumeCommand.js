module.exports = {
	name: 'resume',
	description: 'Resumes the paused song',
	execute(receivedMessage, arguments, client) {
		dispatcher = client.variables.get("dispatcher" + receivedMessage.guild.id)
        if(dispatcher)dispatcher.resume()
	},
};