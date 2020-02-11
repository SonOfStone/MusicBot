module.exports = {
	name: 'uwu',
	description: 'Repeats your text but UwU-ified',
	execute(receivedMessage, arguments, client) {
        
        //function to return a uwu converted word
        function uwuIfyWord(word){
            var uwuWord = ""
            for(var i = 0; i < word.length; i++){
                if(['l','r'].indexOf(word.charAt(i)) >= 0){
                    uwuWord += "w"
                }else if(['L','R'].indexOf(word.charAt(i)) >= 0){
                    uwuWord += "W"
                }else if(word.charAt(i) == "n" && word.charAt(i+1).toLowerCase() == "o"){
                    uwuWord += "ny"
                }else if(word.charAt(i) == "N" && word.charAt(i+1).toLowerCase() == "o"){
                    uwuWord += "Ny"
                }else{
                    uwuWord += word.charAt(i)
                }
            }
            console.log(uwuWord)
            uwuWord += word.charAt(word.length)
            console.log(uwuWord)
            return uwuWord
        }
        
        //for loop to format the words back into sentences.
        var outputstr = ""
        for(i = 0; i < arguments.length; i++){
            if(i != arguments.length - 1){
              outputstr += uwuIfyWord(arguments[i]) + " "
            }else{
              outputstr += uwuIfyWord(arguments[i])
            }
        }
        
        //delete the original command sent by the user
        receivedMessage.delete()
        .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        .catch(console.error);

        receivedMessage.channel.send(outputstr)
	},
};