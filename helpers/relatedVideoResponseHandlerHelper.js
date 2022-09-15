module.exports = {
	name: 'relatedVideoResponseHandler',
	description: 'Handles the response from httpGetAsync with a related video json',
	execute(response, receivedMessage, client) {
        variables = client.variables
        songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        songQueueIds = variables.get("songQueueIds" + receivedMessage.guild.id)
        
        //parse response
        var json = JSON.parse(response);
        
        //grab all video ids in queue
        //maybe don't need this loop anymore
        for(var i=0; i < songQueue.length; i++){
            var videoId = songQueue[i].split("?v=")[1]
            songQueueIds[videoId] = songQueue[i]
        }
        
        var nextVideoId = ""
        var notFound = true
        var counter = 0;
        //find an id in the response not in songQueueIds
        while(notFound && counter < 4){
            var nextVideoId = json["items"][counter]["id"]["videoId"]
            var nextVideoSnippet = json["items"][counter]["snippet"]
            console.log(nextVideoId)
            console.log(songQueueIds)
            //if not in map we found a new video
            if(songQueueIds[nextVideoId] === undefined && nextVideoSnippet !== undefined){
                console.log("found empty element\n\n")
                notFound = false
            }else{
                console.log("trying again \n")
            }
            counter ++
        }
        if(notFound === false){
            var nextUrl = "https://www.youtube.com/watch?v=" + nextVideoId
            //send play command for next video
            client.commands.get("play").execute(receivedMessage, [nextUrl], client)
        }
	},
};