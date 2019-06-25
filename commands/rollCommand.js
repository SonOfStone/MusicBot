module.exports = {
	name: 'roll',
	description: 'Rolls a 6 sided die by default, but if supplied with a number can roll a die with that many sides.',
	execute(receivedMessage, arguments, client) {
        if(arguments[0] == null){
            var number = Math.floor(Math.random() * 6) + 1
            receivedMessage.channel.send("You rolled a " + number)
        }else if(Number.isInteger(Number(arguments[0]))){
            var number = Math.floor(Math.random() * arguments[0]) + 1
            receivedMessage.channel.send("You rolled a " + number)
        }
    }
};