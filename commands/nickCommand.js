module.exports = {
	name: 'nick',
	description: 'hidden command to get a random nickname',
	hide: true,
	execute(receivedMessage, arguments, client) {
		client.helpers.get("getNickname").execute(receivedMessage, client).then((nickname) => {
			member = receivedMessage.member.setNickname(nickname).catch(error => {
				console.error("Failed to set nickname")
			})
		})
	},
};