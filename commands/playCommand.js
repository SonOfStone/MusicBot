module.exports = {
	name: 'play',
	description: 'Plays a linked song',
	execute(receivedMessage, arguments, client) {
        variables = client.variables
        helpers = client.helpers
        console.log(arguments)
        if(arguments.length < 1){
            receivedMessage.channel.send("Please provide a link or some search terms")
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
            //if a song is currently playing display the queue
            broadcast = client.variables.get("broadcast" + receivedMessage.guild.id)
            if(broadcast)client.commands.get("queue").execute(receivedMessage, arguments, client)
                
            if(!receivedMessage.guild.voiceConnection) receivedMessage.member.voiceChannel.join().then(function(connection){
                console.log("accessing play helper")
                helpers.get("play").execute(connection, receivedMessage, client)
            })
            .catch(console.error)
        }else if(arguments[0] !== undefined){
            var apiUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + arguments.join() + "&type=video&key=" + client.variables.get("Api_key")
            var apiCallResponse = helpers.get("httpGetAsync").execute(apiUrl, helpers.get("searchVideoResponseHandler"), receivedMessage, client)
        }else{
            receivedMessage.channel.send("Could not find a video with your link")
        }
	},
};