const { MessageEmbed } = require("discord.js");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let voiceChannel = message.member.voice.channel;
  
  if (!voiceChannel) return message.channel.send(`Please join a voice channel!`);
  
  let searchString = args.join(" ");
  if (!searchString) return message.channel.send(`Please provide query!`)
  
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
          
            return message.channel.send(playing);
        } else {
          
          try {
            var video = await youtube.getVideo(url);
          } catch (e) {
            
            try {
          let videos = await youtube.searchVideos(searchString, 10);
          
          let index = 0;
          
          const searchE = new MessageEmbed()
          .setAuthor(`search result for ${searchString}`, client.user.displayAvatarURL())
          .setColor(config.embed)
          .setFooter('select from 1 - 10! or cancel')
          .setDescription(videos.map(song => `**[${++index}.]** - **${song.title}**\n${song.url}`));
          
          message.channel.send(searchE).then(m => {
            m.delete({
              timeout: 20000
            })
          });
          
          let filter = message2 => message2.author.id == message.author.id && message2.content === "cancel" || message2.content > 0 && message2.content < 11;
              
          let select = await message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 20000
                        });
          
          if (!select.size) return message.channel.send(`Cancel to play song :(`);
              
          if (select.first().content === "cancel") return message.channel.send(`Cancel to play song`)
              
          let _select = parseInt(select.first().content);
            
          var video = await youtube.getVideoByID(videos[_select - 1].id);
            
          return handleVideo(video, message, voiceChannel);              
            } catch (e) {
              return message.channel.send(`Oh no ${e}`)
            }
          
          }
          
          
          
          
          
        }
  
}

exports.config = {
  name: "search",
  description: "Search song you want!",
  aliases: ["sc"],
  cooldown: 10
}