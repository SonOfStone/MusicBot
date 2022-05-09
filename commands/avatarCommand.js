module.exports = {
	name: 'avatar',
	description: 'Return the avatar picture of discord user',
	execute(receivedMessage, arguments, client) {
        const Discord = require('discord.js')
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
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${member.displayName}`)
                    .setImage(member.user.avatarURL())
                    receivedMessage.channel.send({embeds: [embed]})
                }).catch(function(error){
                // second catch is necessary to prevent unhandled exceptions
                console.log("User input wrong ID")
            })
        //get the avatar of person who sent command
        }else{
            const embed = new Discord.MessageEmbed()
                .setTitle(`${receivedMessage.member.displayName}`)
                .setImage(receivedMessage.member.user.avatarURL())
                receivedMessage.channel.send({embeds: [embed]})
            }
	},
};