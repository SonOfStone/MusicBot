module.exports = {
	name: 'smooch',
	description: 'Kiss your friends on the lips by tagging them with this command',
    example: '@Josue',
	execute(receivedMessage, arguments, client) {
        const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
        //if a name is tagged get avatar for that name
        if(arguments[0] !== undefined){
            //get the guild object
            let guild = receivedMessage.member.guild
            //need to strip unnecessary characters from arguments and fetch member
            var input_id = arguments[0].replace(/\D/g,"")
            //fetchMember returns a promise so when done send the avatarURL
            var memberPromise = guild.members.fetch(input_id).catch(function(error){
                //catch if input_id does not match anything
                receivedMessage.channel.send("No user exists in this server")
            }).then(function (member){
                console.log(member)
                console.log(receivedMessage.author)
                const file = new AttachmentBuilder('./src/kiss3.png')
                const embeds = [
                    new EmbedBuilder().setTitle(`${receivedMessage.author.username}`).setImage(receivedMessage.author.avatarURL()).setColor("Red"),
                    new EmbedBuilder().setImage('attachment://kiss3.png').setColor("Red"),
                    new EmbedBuilder().setTitle(`${member.user.username}`).setImage(member.user.avatarURL()).setColor("Red")
                ]
                receivedMessage.channel.send({embeds: embeds, files: [file]})
                }).catch(function(error){
                    // second catch is necessary to prevent unhandled exceptions
                    console.log("User input wrong ID")
                    receivedMessage.channel.send("I encountered an issue. Did you tag your friend correctly?")
                })
        //there are no arguments so let user know
        }else{
            receivedMessage.channel.send("Please tag your friend")
        }
	},
};