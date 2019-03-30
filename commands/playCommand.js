module.exports = {
	name: 'play',
	description: 'Plays a linked song',
	execute(receivedMessage, arguments, client) {
        variables = client.variables
        helpers = client.helpers
        if(arguments.length != 1){
            receivedMessage.channel.send("Please provide a link")
            return
        }
        if(!receivedMessage.member.voiceChannel){
            receivedMessage.channel.send("You must be in a voice channel")
            return
        }
        //check if link is good
        var youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
        if(arguments[0].match(youtubeRegex)){
            console.log("pushing " + arguments[0])
            //check if server already has a queue
            if(variables.has("songQueue" + receivedMessage.guild.id)){
                songQueue = variables.get("songQueue" + receivedMessage.guild.id)
            //if no queue create one
            }else{
                variables.set("songQueue" + receivedMessage.guild.id, [])
                songQueue = variables.get("songQueue" + receivedMessage.guild.id)
            }
            //if no queueids create one
            if(variables.has("songQueueIds" + receivedMessage.guild.id)){
                songQueueIds = variables.get("songQueueIds" + receivedMessage.guild.id)
            }else{
                variables.set("songQueueIds" + receivedMessage.guild.id, [])
                songQueueIds = variables.get("songQueueIds" + receivedMessage.guild.id)
            }
            songQueue.push(arguments[0])
            var videoId = arguments[0].split("?v=")[1]
            songQueueIds[videoId] = arguments[0]
            //display queue if bigger than 1
            if(songQueue.length > 1)client.commands.get("queue").execute(receivedMessage, arguments, client)
            if(!receivedMessage.guild.voiceConnection) receivedMessage.member.voiceChannel.join().then(function(connection){
                helpers.get("play").execute(connection, receivedMessage, client)
            })
            .catch(console.error)
        }else{
            receivedMessage.channel.send("Could not find a video with your link")
        }
	},
};