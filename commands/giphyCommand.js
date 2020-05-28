module.exports = {
	name: 'giphy',
	description: 'posts a related gif from giphy based on search terms',
    example: 'relatable',
	execute(receivedMessage, arguments, client) {
        variables = client.variables
        helpers = client.helpers
        console.log(arguments)
        //check if there are any arguments
        if(arguments.length < 1){
            receivedMessage.channel.send("Please provide some search terms")
            return
        }
        receivedMessage.delete()
        //send the arguments to giphy api
        var apiUrl = "https://api.giphy.com/v1/gifs/search?api_key=" + client.variables.get("giphy_key") + "&q=" + arguments.join() + "&limit=1"; 
        var apiCallResponse = helpers.get("httpGetAsync").execute(apiUrl, helpers.get("giphyHandler"), receivedMessage, client)
	},
};