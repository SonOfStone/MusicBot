module.exports = {
	name: 'relatedVideoResponseHandler',
	description: 'Handles the response from httpGetAsync with a related video json',
	execute(response, receivedMessage, client) {
        variables = client.variables
        songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        songQueueIds = variables.get("songQueueIds" + receivedMessage.guild.id)
        
        var json = JSON.parse(response);
        for(var i=0; i < songQueue.length; i++){
            var videoId = songQueue[i].split("?v=")[1]
            songQueueIds[videoId] = songQueue[i]
        }
        
        var nextVideoId = ""
        var notFound = true
        var counter = 0
        while(notFound && counter <= 4){
            var nextVideoId = json["items"][counter]["id"]["videoId"]
            console.log(nextVideoId)
            console.log(songQueueIds)
            if(songQueueIds[nextVideoId] == null){
                console.log("found empty element\n\n")
                notFound = false
            }else{
                console.log("trying again \n")
            }
            counter ++
        }
        var nextUrl = "https://www.youtube.com/watch?v=" + nextVideoId
        songQueueIds[nextVideoId] = nextUrl
        console.log("WE ARE PLAYING NEXT " + nextUrl)
        songQueue.push(nextUrl)
        client.commands.get("queue").execute(receivedMessage, arguments, client)
	},
};