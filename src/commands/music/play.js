exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  if (!message.member.voice.channel) return message.channel.send("Please join a voice channel first ! >:c");
  
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, message, message.member.voice.channel, true); // eslint-disable-line no-await-in-loop
            }
          
          const playing = new client.embed()
          .setAuthor("New song has been added to queue!")
          .setColor(config.color)
          .setDescription(`Succesfully added ${playlist.title}!`)
          
            return message.channel.send(playing)
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(args.join(" "), 10);
                    var video = await youtube.getVideoByID(videos[0].id);
                    if (!video) return message.channel.send("Im unable to find videos with this query, try again")
                } catch (err) {
                    console.error(err);
                    return message.channel.send("Im unable to find videos with this query")
                }
            }
            handleVideo(video, message, message.member.voice.channel);
        }  
  
}

exports.config = {
  name: "play",
  description: "Play music easly!",
  aliases: ["p", "putar"],
  cooldown: 10
}