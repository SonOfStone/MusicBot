module.exports = {
	name: 'pause',
	description: 'Pauses the current song',
	execute(receivedMessage, arguments, client) {
        broadcast = client.variables.get("broadcast" + receivedMessage.guild.id)
        if(broadcast)broadcast.pause()
	},
};