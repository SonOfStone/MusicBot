module.exports = {
	name: 'httpGetAsync',
	description: 'Get asynchronous http data',
	execute(theUrl, callback, receivedMessage, client, outputStartText) {
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
        var xmlHttp = new XMLHttpRequest()
        xmlHttp.responseType = "json"
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                // console.log("we made it")
                callback.execute(xmlHttp.responseText, receivedMessage, client, outputStartText)
        }
        console.log(theUrl)
        var encodedURL = encodeURI(theUrl)
        xmlHttp.open("GET", encodedURL, true) // true for asynchronous 
        xmlHttp.send(null)
	},
};