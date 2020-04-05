module.exports = {
	name: 'ping',
	description: 'Bot responds with pong',
    example: 'pong',
	execute(receivedMessage, arguments, client) {
        receivedMessage.channel.send("pong")
	},
};