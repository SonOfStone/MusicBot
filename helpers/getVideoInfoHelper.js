module.exports = {
	name: 'getVideoInfo',
	description: 'Calls YouTube api to get video info',
	execute(videoUrl, receivedMessage, client, outputStartText) {
        helpers = client.helpers
       	var youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
        var videoId = videoUrl.split("?v=")[1]
        if(videoUrl.match(youtubeRegex)){
            var apiUrl = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&fields=items(id,snippet(title,description),contentDetails)&part=snippet,contentDetails&key=" + client.variables.get("Api_key")
            var apiCallResponse = helpers.get("httpGetAsync").execute(apiUrl, helpers.get("videoInfoHandler"), receivedMessage, client, outputStartText)
        }else{
            receivedMessage.channel.send("Could not find a video.")
        }
	},
};