module.exports = {
	name: 'next',
	description: 'Skips the current song',
	execute(receivedMessage, arguments, client) {
		commands = client.commands

        commands.get("skip").execute(receivedMessage, arguments, client);
	},
};