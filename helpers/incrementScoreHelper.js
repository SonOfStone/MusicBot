module.exports = {
	name: 'incrementScore',
	description: 'Adds 1 to the score of the person who failed roulette',
	execute(member, client) {
        var scores = client.variables.get("scores")
        var oldScore = scores[member.id]
        if(oldScore !== undefined){
            scores[member.id] = oldScore + 1
        }else{
            scores[member.id] = 1
        }
        client.variables.set("score", scores)
        var fs = require("fs")
        //write new scores to file
        fs.writeFile("./src/scores.json", JSON.stringify(scores), function(err){
            if(err) throw err
            console.log("complete")
            }
        );
	},
};