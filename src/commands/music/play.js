exports.run = async (message, client, args, config) => {

  if (!message.member.voice.channel) return message.channel.send("Please join a voice channel first ! >:c");
  
        if (client.url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await client.youtube.getPlaylist(client.url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await client.youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await client.handleVideo(video2, message, message.member.voice.channel, true); // eslint-disable-line no-await-in-loop
            }
            return message.channel.send()
        } else {
            try {
                var video = await client.youtube.getVideo(client.url);
            } catch (error) {
                try {
                    var videos = await client.youtube.searchVideos(args.join(""), 10);
                    var video = await youtube.getVideoByID(videos[0].id);
                    if (!video) return message.channel.send({
                        embed: {
                            color: color,
                            description: "Sorry, nothing found"
                        }
                    });
                } catch (err) {
                    console.error(err);
                    return message.channel.send({
                        embed: {
                            color: color,
                            description: "Sorry, nothing found"
                        }
                    });
                }
            }
            const a = handleVideo(video, message, voiceChannel);
        }  
  
}

exports.config = {
  name: "play",
  description: "Play music easly!",
  aliases: ["p", "putar"],
  cooldown: 10
}