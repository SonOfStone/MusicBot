module.exports = {
	name: 'channel',
	description: 'Backend command to grab ids',
    example: 'channel',
	execute(receivedMessage, arguments, client) {
        console.log(receivedMessage)
	},
};