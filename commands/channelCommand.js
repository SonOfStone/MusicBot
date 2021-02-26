module.exports = {
	name: 'channel',
	description: 'Backend command to grab ids',
	example: 'channel',
	hide: true,
	execute(receivedMessage, arguments, client) {
		console.log(receivedMessage)
	},
};