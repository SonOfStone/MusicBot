module.exports = {
	name: 'next',
	description: 'Skips the current song',
	execute(receivedMessage, arguments, client) {
        broadcast = client.variables.get("broadcast" + receivedMessage.guild.id)
        if(broadcast)broadcast.destroy()
	},
};