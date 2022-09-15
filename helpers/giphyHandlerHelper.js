module.exports = {
	name: 'giphyHandler',
	description: 'recieves giphy data and posts to chat',
    execute(response, receivedMessage, client) {
        const { EmbedBuilder } = require('discord.js')
        variables = client.variables;
        
        var json = JSON.parse(response);
        
        var giphyImage = json["data"][0]["images"]["original"]["url"];

        //create embed for image
        const embed = new EmbedBuilder()
            .setImage(giphyImage);
            receivedMessage.channel.send({embeds: [embed]})
	},
};