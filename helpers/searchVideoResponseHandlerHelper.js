module.exports = {
	name: 'searchVideoResponseHandler',
	description: 'Calls YouTube api to find a video',
    execute(response, receivedMessage, client) {
        variables = client.variables
        songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        songQueueIds = variables.get("songQueueIds" + receivedMessage.guild.id)
        
        var json = JSON.parse(response);
        console.log("made it to searchResponseHandler")
        
        //if there is a result
        if(json["items"][0] !== undefined){
            var nextVideoId = json["items"][0]["id"]["videoId"]

            var nextUrl = "https://www.youtube.com/watch?v=" + nextVideoId
            client.commands.get("play").execute(receivedMessage, [nextUrl], client)
        //else there are no results
        }else{
            receivedMessage.channel.send("There are no results found.")
        }
	},
};