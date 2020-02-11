module.exports = {
	name: 'help',
	description: 'Gives a description of the command supplied or a list of commands',
	execute(receivedMessage, arguments, client) {
        //if supplied an argument return help on that command
        if(arguments.length > 0){
            helpMsg = client.commands.get(arguments[0]).description + "\n" + "Usage: " + client.variables.get("prefix")+ client.commands.get(arguments[0]).name
            if(client.commands.get(arguments[0]).example !== undefined){
                helpMsg += " " + client.commands.get(arguments[0]).example
            }
            receivedMessage.channel.send(helpMsg)
        //else give a list of commands
        }else{
            var listOfCommands = "Here are the commands: \n"
            var values = client.commands.values()
            for(var ele of values){
                //make sure not to include clip commands
                if(ele.name !== "playClip"){
                    listOfCommands += ele.name + " | "
                }
            }
            //cutoff last 3 characters and send message
            listOfCommands = listOfCommands.substring(0, listOfCommands.length-3)
            receivedMessage.channel.send(listOfCommands)
        }
	},
};