module.exports = {
	name: 'sarcasm',
	description: 'Repeats your text but with sarcasm',
	execute(receivedMessage, arguments, client) {
        
        //function to return an upper or lowercase string when given a string
        function giveCase(character){
            var number = Math.floor(Math.random() * 2) == 1
            if(number){
                return character.toUpperCase()
            }else{
                return character.toLowerCase()
            }
        }
        
        //function to return a string with case randomly determined given a string
        function randomizeWord(word){
            var randomizedWord = ""
            for(var i = 0; i < word.length; i++){
                randomizedWord += giveCase(word.charAt(i))
            }
            return randomizedWord
        }
        
        //for loop to format the words back into sentences.
        var outputstr = ""
        for(i = 0; i < arguments.length; i++){
            if(i != arguments.length - 1){
              outputstr += randomizeWord(arguments[i]) + " "
            }else{
              outputstr += randomizeWord(arguments[i])
            }
        }
        
        //delete the original command sent by the user
        receivedMessage.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);

        receivedMessage.channel.send(outputstr)
	},
};