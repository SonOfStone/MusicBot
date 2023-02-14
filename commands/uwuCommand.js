module.exports = {
	name: 'uwu',
	description: 'Repeats your text but UwU-ified',
    example: 'See me wag my little baby tail all over you',
	execute(receivedMessage, arguments, client) {
        
        //function to return a uwu converted word
        function uwuIfyWord(word){
            var uwuWord = ""
            var i = 0
            while(i < word.length){
                if(['l','r'].indexOf(word.charAt(i)) >= 0){
                    uwuWord += "w"
                }else if(['L','R'].indexOf(word.charAt(i)) >= 0){
                    uwuWord += "W"
                }else if(word.charAt(i) == "n" && word.charAt(i+1).toLowerCase() == "o"){
                    uwuWord += "ny"
                }else if(word.charAt(i) == "N" && word.charAt(i+1).toLowerCase() == "o"){
                    uwuWord += "Ny"
                }else if(word.charAt(i) == "t" && word.charAt(i+1).toLowerCase() == "t"){
                    uwuWord += "dd"
                    i++
                }else{
                    uwuWord += word.charAt(i)
                }
                i++
            }
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

        if(outputstr != ""){
            receivedMessage.channel.send(outputstr)
        }
	},
};