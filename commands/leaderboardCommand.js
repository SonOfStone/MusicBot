module.exports = {
	name: 'leaderboard',
	description: 'Lists the top 5 biggest losers',
	execute(receivedMessage, arguments, client) {
        //grab a list of members in the discord server
        var members = receivedMessage.guild.members.cache.values();

        const memberIterator = members[Symbol.iterator]();

        //initialize json
        var leaders = {};

        //get scores for all members
        for(const member of members){
            console.log(member)
            console.log(member.user.id)
            var personal_score = client.helpers.get("getScore").execute(member, client);
            leaders[personal_score] = member
        }
                
        //use the scores as keys and grab the last 5
        scores = Object.keys(leaders)
        var outputStr = "Biggest Losers: "
        for(var i=1; i < 6 && i < scores.length; i++){
            const score = scores[scores.length-i];
            const displayName = leaders[score].displayName
            outputStr += "\n        " + displayName + " : " + score;
        }
        receivedMessage.channel.send(outputStr);
    }
};