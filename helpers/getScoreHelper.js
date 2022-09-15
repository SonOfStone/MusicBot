module.exports = {
	name: 'getScore',
	description: 'Calls YouTube api to get video info',
	execute(member, client) {
        var scores = client.variables.get("scores")
        if(scores[member.user.id] !== undefined){
            return scores[member.id]
        }else{
            return 0
        }
	},
};