module.exports = {
	name: 'getRelatedVideo',
	description: 'Calls the http async helper to get a related video',
	execute(videoUrl, receivedMessage, client) {
        helpers = client.helpers
        var videoId = videoUrl.split("?v=")[1]
        var apiUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=" + videoId + "&type=video&key=" + client.variables.get("Api_key")
        var apiCallResponse = helpers.get("httpGetAsync").execute(apiUrl, helpers.get("relatedVideoResponseHandler"), receivedMessage, client)
	},
};