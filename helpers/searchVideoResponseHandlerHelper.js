module.exports = {
	name: 'searchVideoResponseHandler',
	description: 'Calls YouTube api to find a video',
    execute(response, receivedMessage, client) {
        variables = client.variables
        songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        songQueueIds = variables.get("songQueueIds" + receivedMessage.guild.id)
        
        var json = JSON.parse(response);
        
        //change 0 when we expand later on in development
        var nextVideoId = json["items"][0]["id"]["videoId"]

        var nextUrl = "https://www.youtube.com/watch?v=" + nextVideoId
        client.commands.get("play").execute(receivedMessage, [nextUrl], client)
	},
};