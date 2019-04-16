module.exports = {
	name: 'autoplay',
	description: 'Turns on autoplay, and if supplied with a link plays that song also',
	execute(receivedMessage, arguments, client) {
        variables = client.variables
        helpers = client.helpers
        if(variables.has("autoPlayFlag" + receivedMessage.guild.id)){
            autoPlayFlag = variables.get("autoPlayFlag" + receivedMessage.guild.id)
        }else{
            variables.set("autoPlayFlag" + receivedMessage.guild.id, false)
            autoPlayFlag = variables.get("autoPlayFlag" + receivedMessage.guild.id)
        }
        
        if(variables.has("songQueue" + receivedMessage.guild.id)){
            songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        //if no queue create one
        }else{
            variables.set("songQueue" + receivedMessage.guild.id, [])
            songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        }
        
        if(arguments.length==1){
            variables.set("autoPlayFlag" + receivedMessage.guild.id, true)
            client.commands.get("play").execute(receivedMessage, arguments, client)
        }else if(arguments.length==0){
            //make sure autoPlayFlag is defined
            if(autoPlayFlag === true || autoPlayFlag === false){
                autoPlayFlag = !autoPlayFlag
            //if not defined make true
            }else{
                autoPlayFlag = true
            }
            variables.set("autoPlayFlag" + receivedMessage.guild.id, autoPlayFlag)
            //if autoplay is on start autoplaying
            if(autoPlayFlag){
                receivedMessage.channel.send("Autoplay is on.")
                lastSong = variables.get("lastSong" + receivedMessage.guild.id)
                if(autoPlayFlag && songQueue.length == 0 && lastSong !== undefined){
                    console.log(lastSong)
                    //trying to find next song
                    console.log("finding next song")
                    helpers.get("getRelatedVideo").execute(lastSong, receivedMessage, client)
                }
            }else{
                receivedMessage.channel.send("Autoplay is off.")
            }
            
        }
	},
};