module.exports = {
	name: 'meme',
	description: 'Returns a meme from reddit',
	execute(receivedMessage, arguments, client) {
        const sf = require('snekfetch')
        const Discord = require('discord.js')

        sf.get(`https://www.reddit.com/r/memes/random.json?limit=1`).then(res => {
            console.log(res.body[0].data.children[0].data.url)
            const newEmbed = new Discord.MessageEmbed()
                .setColor("DARK_BLUE")
                .setTitle(res.body[0].data.children[0].data.title)
                .setURL("https://reddit.com/" + res.body[0].data.children[0].data.permalink)
                .setImage(res.body[0].data.children[0].data.url)
            receivedMessage.channel.send(newEmbed)

        });
	},
};