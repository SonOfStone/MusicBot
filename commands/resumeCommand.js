module.exports = {
	name: 'resume',
	description: 'Resumes the paused song',
	execute(receivedMessage, arguments, client) {
        broadcast = client.variables.get("broadcast" + receivedMessage.guild.id)
        if(broadcast)broadcast.resume()
	},
};