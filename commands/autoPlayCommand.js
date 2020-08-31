module.exports = {
	name: 'autoplay',
    description: 'Turns on and off autoplay. Defaults the type to recommended but can specify the type to random. If supplied with a link plays that song and grabs recommended ones',
    example: ", {prefix}autoplay random, {prefix}autoplay pandora, {prefix}autoplay Never gonna give you up",
	execute(receivedMessage, arguments, client) {
        variables = client.variables
        helpers = client.helpers
        
        //get autoPlayFlag
        if(variables.has("autoPlayFlag" + receivedMessage.guild.id)){
            autoPlayFlag = variables.get("autoPlayFlag" + receivedMessage.guild.id)
        }else{
            variables.set("autoPlayFlag" + receivedMessage.guild.id, "off")
            autoPlayFlag = variables.get("autoPlayFlag" + receivedMessage.guild.id)
        }
        
        if(variables.has("songQueue" + receivedMessage.guild.id)){
            songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        //if no queue create one
        }else{
            variables.set("songQueue" + receivedMessage.guild.id, [])
            songQueue = variables.get("songQueue" + receivedMessage.guild.id)
        }
        
        //if supplied an argument set autoplay to that argument or look for the song supplied
        if(arguments.length>=1){
            //check if argument is the literal "random"
            if(arguments[0].toLowerCase() == "random"){
                receivedMessage.channel.send("Autoplay is on random.")
                variables.set("autoPlayFlag" + receivedMessage.guild.id, "random");
                client.commands.get("randomsong").execute(receivedMessage, [], client);
            //check if the argument is the literal "pandora"
            }else if(arguments[0].toLowerCase() == "pandora"){
                receivedMessage.channel.send("Autoplay is on pandora.")
                variables.set("autoPlayFlag" + receivedMessage.guild.id, "pandora");
                client.commands.get("pandora").execute(receivedMessage, [], client);
            //else a song was supplied and do the play command on the argument
            }else{
                variables.set("autoPlayFlag" + receivedMessage.guild.id, "recommended");
                client.commands.get("play").execute(receivedMessage, arguments, client);
            }
        //if no argument
        }else if(arguments.length==0){
            //toggle to recommended if autoplay is off or undefined
            if(autoPlayFlag === undefined || autoPlayFlag === "off"){
                autoPlayFlag = "recommended";
            //if it is on another type of autoplay turn it off
            }else{
                autoPlayFlag = "off"
            }
            variables.set("autoPlayFlag" + receivedMessage.guild.id, autoPlayFlag)
            //if autoplay is on start autoplaying
            if(autoPlayFlag == "recommended"){
                receivedMessage.channel.send("Autoplay is on recommended.")
                lastSong = variables.get("lastSong" + receivedMessage.guild.id)
                if(songQueue.length == 0 && lastSong !== undefined){
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