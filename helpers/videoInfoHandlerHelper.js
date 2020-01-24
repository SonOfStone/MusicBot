module.exports = {
	name: 'videoInfoHandler',
	description: 'Calls YouTube api to get video info',
	execute(response, receivedMessage, client, outputStartText) {
        const Discord = require("discord.js")
        helpers = client.helpers
        var json = JSON.parse(response)
        
        //if the api response has a description grab it and output in an embed
        if(json["items"][0]!== undefined){
            var title = json["items"][0]["snippet"]["title"]
            var titleCharLimit = 45
            var url = "https://www.youtube.com/watch?v=" + json["items"][0]["id"]
            if(title.length > titleCharLimit){
                title = title.substr(0, titleCharLimit)
                title += "..."
                title = title.replace("[", "")
                title = title.replace("]", "")
            }
            title = "[" + title + "]" + "(https://www.youtube.com/watch?v=" + json["items"][0]["id"] + ")"
            
            var duration = json["items"][0]["contentDetails"]["duration"]
            duration = helpers.get("convertTime").execute(duration)
            
            var description = json["items"][0]["snippet"]["description"]
            var charLimit = 150
            description = description.substr(0,charLimit)+"..."
            //I did not want description at this time so empty string
            description = ""
            
            if(outputStartText==null) var outputStartText = "Playing "
            var outputStr = outputStartText + title + "   " + duration + "\n" + description
            const embed = new Discord.RichEmbed()
                .setColor(0xFF0000)
                .setDescription(outputStr)
            receivedMessage.channel.send(embed)
        //the api did not return any info so send the user a message
        }else{
            if(outputStartText==null) var outputStartText = "Playing "
            var outputStr = outputStartText + "linked video \n But I could not find any info"
            const embed = new Discord.RichEmbed()
                .setColor(0xFF0000)
                .setDescription(outputStr)
            receivedMessage.channel.send(embed)
        }
	},
};