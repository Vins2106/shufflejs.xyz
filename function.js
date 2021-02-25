const { Util, music, ytdl, client, config } = require("./server.js"); 

async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = music.get(message.guild.id);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        duration: video.duration,
        thumbnail: video.thumbnails.medium,
        user: message.author
    };
    if (!serverQueue) {
        const queueConstruct = {
          channel: {
            text: message.channel,
            voice: voiceChannel
          },
          opt: {
            connection: null,
            volume: 100,
            playing: true,
            loop: false
          },
          songs: []
        };
        music.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.opt.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            music.delete(message.guild.id);
            return message.channel.send(`i cannot join voice channel because: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        const playing = new client.embed()
        .setAuthor(`Playing music`)
        .setColor(config.color)
        .description(`Now playing **${song.title}** - **${song.duration}** (<@${song.user.id}>)`)
        .setImage(song.thumbnail)
        
        if (playlist) return;
      
        else return message.channel.send(playing);
    }
    return;
}

function play(guild, song) {
    const serverQueue = music.get(guild.id);

    if (!song) {
        serverQueue.channel.voice.leave();
        return music.delete(guild.id);
    }

    const dispatcher = serverQueue.opt.connection.play(ytdl(song.url))
        .on("finish", () => {
            const shiffed = serverQueue.songs.shift();
            if (serverQueue.opt.loop === true) {
                serverQueue.songs.push(shiffed);
            };
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolume(serverQueue.volume / 100);

        const playing = new client.embed()
        .setAuthor(`Playing music`)
        .setColor(config.color)
        .description(`Now playing **${song.title}** - **${song.duration}**`)
        .setImage(song.thumbnail)  
  
    serverQueue.channel.text.send(playing).then(m => m.delete({
      timeout: 5000
    }));
}


module.exports = {handleVideo, play}

