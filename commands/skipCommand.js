module.exports = {
	name: 'skip',
	description: 'Skips the current song',
	execute(receivedMessage, arguments, client) {
        player = client.variables.get("player" + receivedMessage.guild.id)
        if(player)player.stop()
	},
};