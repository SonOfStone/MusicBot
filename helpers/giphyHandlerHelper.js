module.exports = {
	name: 'giphyHandler',
	description: 'recieves giphy data and posts to chat',
    execute(response, receivedMessage, client) {
        const Discord = require('discord.js')
        variables = client.variables;
        
        var json = JSON.parse(response);
        
        var giphyImage = json["data"][0]["images"]["original"]["url"];

        //create embed for image
        const embed = new Discord.RichEmbed()
            .setImage(giphyImage);
        receivedMessage.channel.send(embed);
	},
};