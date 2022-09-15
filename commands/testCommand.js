module.exports = {
	name: 'test',
	description: 'Plays a linked song',
    example: 'all star lyrics',
	execute(receivedMessage, arguments, client) {
        variables = client.variables
        helpers = client.helpers
        console.log(arguments)

        //audio player stuff
        const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');
        const { createReadStream } = require('node:fs');

        //ytdl stuff
        const ytdl = require('ytdl-core')
    
        const stream = ytdl("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {filter: "audio", highWaterMark: 1<<25, requestOptions: {
            headers: {
                cookie: variables.get("youtubeCookie")
            }
        }})

        //on resolve
        // helpers.get("player").execute(receivedMessage, client).then(value =>{

        //     let resource = createAudioResource(stream, {
        //         inlineVolume : true
        //     });

        //     const connection = variables.get("player" + receivedMessage.guild.id)
        //     console.log(connection);
        //     connection.play(resource);
        // })
        helpers.get("player").execute(receivedMessage, client)
        let resource = createAudioResource(stream, {
            inlineVolume : true
        });

        const player = variables.get("player" + receivedMessage.guild.id)
        player.play(resource);
	},
};