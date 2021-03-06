module.exports = {
	name: 'roulette',
	description: 'Moves a random user in a voice channel to the assigned channel',
	execute(receivedMessage, arguments, client) {
        const now = new Date();
        //cooldown in seconds
        if(client.variables.has("lastRouletteUsage" + receivedMessage.guild.id)){
            lastCommandUsage = client.variables.get("lastRouletteUsage" + receivedMessage.guild.id)
        }else{
            lastCommandUsage = 0
        }
        
        if (now - lastCommandUsage > 5 * 1000) {
            const voiceChannel = receivedMessage.member.voice.channel
            if(voiceChannel !== undefined){
                var members = voiceChannel.members
                var randomMember = members.random()
                //increment the member's score
                client.helpers.get("incrementScore").execute(randomMember, client)
                //grab the afk channel from the variables and move the user to that channel
                randomMember.voice.setChannel(client.variables.get("rouletteChannel"))
                    .then(() => console.log(`Moved ${randomMember.displayName}`))
                    .catch(console.error);
                var personal_score = client.helpers.get("getScore").execute(randomMember, client)
                receivedMessage.channel.send(`${randomMember.toString()} has lost the roulette ${personal_score} times!`)
                lastCommandUsage = now
                client.variables.set("lastRouletteUsage" + receivedMessage.guild.id, lastCommandUsage)
                //attempt to return user to original channel asynchronously
                setTimeout(function(){  
                    randomMember.voice.setChannel(voiceChannel)
                        .then(() => console.log(`Moved ${randomMember.displayName}`))
                        .catch(console.error);
                }, 10000)
            }else{
                receivedMessage.channel.send("You are not in a voice channel")
            }
        }else{
            receivedMessage.channel.send("The roulette command is on cooldown")
        }
	},
};