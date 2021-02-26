module.exports = {
	name: 'getNickname',
	description: 'Calls namefake.com to get a random name',
	execute(receivedMessage, client, userId) {
		const sf = require('snekfetch')

		var apiUrl = "http://api.namefake.com/english-united-states/";

		return(sf.get(apiUrl).then(res => {
			response = JSON.parse(res.text)
			console.log(response.name)
            return(response.name)
        }));
	},
};