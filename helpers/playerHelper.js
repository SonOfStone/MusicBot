module.exports = {
	name: 'player',
	description: 'establishes a voice connection and audio player and if one exists returns the player',
    execute: async function (receivedMessage, client) {
        execute(receivedMessage, client)
    }
};

async function execute(receivedMessage, client) {
    //simplifying calls
    variables = client.variables
    helpers = client.helpers
    
    const { joinVoiceChannel, AudioPlayer } = require('@discordjs/voice');
    const { createAudioPlayer, createAudioResource } = require('@discordjs/voice');
    const { createReadStream } = require('node:fs');

    //may need to create singleton or something here
    const player = createAudioPlayer();
    const connection = joinVoiceChannel({
        channelId: receivedMessage.member.voice.channel.id,
        guildId: receivedMessage.channel.guild.id,
        adapterCreator: receivedMessage.channel.guild.voiceAdapterCreator,
    }).subscribe(player);

    let resource = createAudioResource(createReadStream('src/clips/ah.mp3'), {
        inlineVolume : true
    });

    // player.on('error', error => {
    //     console.error('Error:', error.message);
    // });

    // connection.connection.on('stateChange', (oldState, newState) => {
    //     console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
    // });
    player.on('stateChange', (oldState, newState) => {
        console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
    });

    variables.set("player" + receivedMessage.guild.id, player)
}