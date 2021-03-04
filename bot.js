const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: "everyone"
});

require("dotenv").config();
let config = require("./config.js");

const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const api = config.yt_api;
const youtube = new YouTube(api);
const music = new Map();
const { Util } = require("discord.js")
const fs = require("fs");

client.embed = Discord.MessageEmbed;

client.guildConfig = require("quick.db")

client.login(config.token)

client.commands = new Discord.Collection();
client.modules = new Discord.Collection();
client.aliases = new Discord.Collection();

require("./src/module.js")(client, fs)

// events

client.on("ready", () => {
  client.user.setActivity("Maroon 5 - Girls Like You ft. Cardi B (Official Music Video)", {type: "PLAYING"})
  
  console.log(`Login as ${client.user.username}`)
  
  let joinforcreate = require("./src/jfc/joinforcreate.js");
  joinforcreate(client)
});

let prefix = config.prefix;
 
client.on("voiceStateUpdate", async (oldS, newS) => {
  
  let _loe = client.guildConfig.get(`config.${oldS.guild.id}.leaveOnEmpty`);
  
  if (_loe) {
  if (music.get(oldS.guild.id)) {
    if (music.get(oldS.guild.id).voiceChannel.id == oldS.channelID) {
      try {
      if (oldS.channel.members.size < 2) {
       setTimeout(function() {
        if (oldS.channel.members.size < 2) {
        music.get(oldS.guild.id).voiceChannel.leave();
          
        music.delete(oldS.guild.id);
      } else {
        return;
      }
       }, 60000) 
      }        
      } catch (e) {
        console.log(`oh no ${e}`)
      }
    }
  }    
  } else if (!_loe) {
    return;
  }
  
})

client.on("guildCreate", async guild => {
  client.guildConfig.set(`config.${guild.id}`, {
    leaveOnEmpty: true
  })
});

client.on("guildDelete", async guild => {
  if (client.guildConfig.get(`config.${guild.id}`)) {
    client.guildConfig.delete(`config.${guild.id}`);
  }
});

client.on("message", async message => {
   
  if (!message.content.startsWith(prefix)) return;
  
  const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift();
  
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  client.url = url;
  
  
  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;
  
  command.run(message, client, args, music, config, handleVideo, play, youtube, url)
})

// events akhir

async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = music.get(message.guild.id);
    if (video.duration.minutes == 0) return message.channel.send(`I can't play songs that are under 1 minute`)
  
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail: video.thumbnails.medium,
        duration: video.duration,
        formatDuration: video.durationSeconds,
        user: message.author,
        guild: message.guild,
        message
    };
    if (!serverQueue) {
      
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            playing: true,
            loop: false,
            shuffle: false,
            autoplay: true,
            latestSong: song,
            stopped: false
        };
        music.set(message.guild.id, queueConstruct);
        music.get(message.guild.id).songs.push(song);

        try {
            var connection = await voiceChannel.join()
            queueConstruct.connection = connection;
            play(message, queueConstruct.songs[0]);
            
          connection.voice.setSelfDeaf(true); 
          
        } catch (error) {
            console.error(`I cannot join voice channel because do not have permission to join or speak!`);
            return music.delete(message.guild.id);
        }
    } else {
        serverQueue.songs.push(song);
        if (playlist) return;
        else return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor("New song added to queue!")
          .setColor(config.embed)
          .setTitle(`${song.title} - ${song.duration.hours} : ${song.duration.minutes} : ${song.duration.seconds}`)
          .setDescription(`${song.url}`)
          .setImage(song.thumbnail.url)
        );
    }
    return;
}

async function play(message, song) {
  const guild = message.guild;
  
    const serverQueue = music.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        serverQueue.textChannel.send(`Wow! looks like no more song in queue, use me again with **${config.prefix}play** \:D`).then(m => m.delete({
          timeout: 5000
        }))
      
        return music.delete(message.guild.id)
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url), { highWaterMark: 1 >> 25 }, {type: serverQueue.songs[0].url.includes("youtube.com") ? "opus" : "ogg/opus"})
        .on("finish", async () => { 
          try {
            const shiffed = serverQueue.songs.shift();
            if (serverQueue.loop === true) {
                serverQueue.songs.push(shiffed);
            };
            
          if (serverQueue.latestSong) {
          serverQueue.latestSong = serverQueue.songs[0];
          return play(message, serverQueue.songs[0])            
          }
            // autoplay
            if (!serverQueue.songs[0]) {
              if (serverQueue.stopped) {
                serverQueue.songs = [];
                serverQueue.voiceChannel.leave();
                
                return music.delete(message.guild.id)
              }
              
//               auto play
        if (serverQueue.autoplay) {
          
          let _related = await ytdl.getInfo(serverQueue.latestSong.id);
          
          let related = _related.response.contents.twoColumnWatchNextResults.autoplay.autoplay.sets[0].autoplayVideo.watchEndpoint.videoId;
          
          let video = await youtube.getVideoByID(related)
          
          let songConstructor =
              {
                  id: video.id,
                  title: Util.escapeMarkdown(video.title),
                  url: `https://www.youtube.com/watch?v=${video.id}`,
                  thumbnail: video.thumbnails.medium,
                  duration: video.duration,
                  formatDuration: video.durationSeconds,
                  user: client.user,
                  guild: message.guild,
                  message                
              }
          
          serverQueue.songs.push(songConstructor)
          
          return play(message, songConstructor)
        } else {
            if (serverQueue.songs[1]) {
          if (serverQueue.shuffle) {
            let random = serverQueue.songs[Math.floor(Math.random() * serverQueue.songs.length)];
            if (!random) return;
            
            serverQueue.latestSong = random;
            
            return play(message, random)
          }
            serverQueue.latestSong = serverQueue.songs[0];
            return play(message, serverQueue.songs[0]);            
            } else {
            serverQueue.latestSong = serverQueue.songs[0];
            return play(message, serverQueue.songs[0]);
            }              
          serverQueue.latestSong = serverQueue.songs[0];
          return play(message, serverQueue.songs[0])
              
        }
            } else {  
              
              // normal
            if (serverQueue.songs[1]) {
          if (serverQueue.shuffle) {
            let random = serverQueue.songs[Math.floor(Math.random() * serverQueue.songs.length)];
            if (!random) return;
            
            serverQueue.latestSong = random;
            return play(message, random)
          }              
            serverQueue.latestSong = serverQueue.songs[0];
              
            return play(message, serverQueue.songs[0]);            
            } else {
            serverQueue.latestSong = serverQueue.songs[0];
            return play(message, serverQueue.songs[0]);
            }
            }
            
          } catch (e) {
            serverQueue.textChannel.send("Cannot play this music, try another music, im sorry :c\n" + e)
          }
        }) 
        .on("error", error => message.channel.send(`Hmm, looks like this is not music video, **404**\n${error}`));
    dispatcher.setVolume(serverQueue.volume / 100);

    serverQueue.textChannel.send(new Discord.MessageEmbed().setAuthor(`Now playing - ${song.user.username}`).setColor(config.embed).setDescription(`**${song.title}** - **${song.duration.hours}** : **${song.duration.minutes}** : **${song.duration.seconds}**`).setImage(song.thumbnail.url).setFooter(`${song.url}`)).then(m => {
      
      m.react("🔁");
      m.react("⏭️");
      m.react("⏯️");
      m.react("🔈");
      m.react("🔉");
      m.react("🔊");
      m.react("🗑️");
      
      const { createReactionMusic } = require("./src/reaction/play.js");
      
      createReactionMusic(m, song, message, client, serverQueue);
      
    })
} 