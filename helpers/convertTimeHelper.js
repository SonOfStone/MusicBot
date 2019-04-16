module.exports = {
	name: 'convertTime',
	description: 'Converts YouTube API time output into a presentable form',
	execute(inputStr) {
        var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        var hours = 0, minutes = 0, seconds = 0, totalseconds;

        if (reptms.test(inputStr)) {
            var matches = reptms.exec(inputStr);
            if (matches[1]) hours = Number(matches[1]);
            if (matches[2]) minutes = Number(matches[2]);
            if (matches[3]) seconds = Number(matches[3]);
            totalseconds = hours * 3600  + minutes * 60 + seconds;
        }
        
        if(hours==0){
            //(minutes 00, seconds 00) e.g. (01:28)
            return(String(minutes).padStart(2,0) + ":" + String(seconds).padStart(2,0))
        }else{
            //(hours 00, minutes 00, seconds 00) e.g. (03:45:28)
            return(String(hours).padStart(2,0) + ":" + String(minutes).padStart(2,0) + ":" + String(seconds).padStart(2,0))
        }
	},
};