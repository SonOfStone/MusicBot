module.exports = {
	name: 'randomsong',
	description: 'Plays a random song from YouTube',
	execute(receivedMessage, arguments, client) {
        variables = client.variables
        helpers = client.helpers
        
        if(!receivedMessage.member.voiceChannel){
            receivedMessage.channel.send("You must be in a voice channel")
            return
        }
        
        const rp = require('request-promise')
        const cheerio = require('cheerio')
        //picks between 6000 songs on ytroulette I may be able to just set to a random number and the website will give me a random song
        var videoNum = Math.floor((Math.random() * 5695))
        const url = 'https://ytroulette.com/?i=' + videoNum + '&c=1&l=en'
        
        rp(url)
            .then(function(html){
                //success!
                const $ = cheerio.load(html)
                var videoTitle = $("head > title").text()
                
                var apiUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=lyrics " + videoTitle + "&type=video&key=" + client.variables.get("Api_key")
                var apiCallResponse = helpers.get("httpGetAsync").execute(apiUrl, helpers.get("searchVideoResponseHandler"), receivedMessage, client)
            })
            .catch(function(err){
                //handle error
                console.log("Encountered an issue loading the random song");
                console.log(err);
            });
	},
};