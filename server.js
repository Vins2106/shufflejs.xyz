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
const Util = require("discord.js")
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
  console.log(`Login as ${client.user.username}`)
});

let prefix = config.prefix;

client.on("voiceStateUpdate", async (oldS, newS) => {
  
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
  
  const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift();
  
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  client.url = url;
  
  
  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;
  
  command.run(message, client, args, music, config, handleVideo, play, youtube, url)
})

// events akhir
 
// function
async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = music.get(message.guild.id);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail: video.thumbnails.medium,
        duration: video.duration,
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
            shuffle: false
        };
        music.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join()
            queueConstruct.connection = connection;
            play(message, queueConstruct.songs[0]);
            
          connection.voice.setSelfDeaf(true); 
          
        } catch (error) {
            console.error(`[ERROR] I could not join the voice channel, because: ${error}`);
            music.delete(message.guild.id);
            return message.channel.send(`I could not join the voice channel, because: **\`${error}\`**`);
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

function play(message, song) {
  const guild = message.guild;
  
    const serverQueue = music.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        serverQueue.textChannel.send(`Wow! looks like no more song in queue, use me again with **${config.prefix}play** \:D`).then(m => m.delete({
          timeout: 5000
        }))
      
        return music.delete(guild.id);
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
        .on("finish", () => {
            const shiffed = serverQueue.songs.shift();
            if (serverQueue.loop === true) {
                serverQueue.songs.push(shiffed);
            };
          if (serverQueue.shuffle) {
            let random = serverQueue.songs[Math.floor(Math.random() * serverQueue.songs.length)];
            if (!random) return;
            
            return play(message, random)
          }
            play(message, serverQueue.songs[0]);
        }) 
        .on("error", error => console.error(`Oh no! ${error}`));
    dispatcher.setVolume(serverQueue.volume / 100);

    serverQueue.textChannel.send(new Discord.MessageEmbed().setAuthor("Now playing").setColor(config.embed).setDescription(`**${song.title}** - **${song.duration.hours}** : **${song.duration.minutes}** : **${song.duration.seconds}**`).setImage(song.thumbnail.url).setFooter(`${song.url}`)).then(m => {
      
      m.react("🔀");
      m.react("🔁");
      m.react("⏭️");
      m.react("⏯️");
      m.react("🔈");
      m.react("🔉");
      m.react("🔊");
      m.react("🗑️");
      
      const filter = (reaction, user) => user.id !== client.user.id;
      var collector = m.createReactionCollector(filter)
      
      collector.on("collect", async (reaction, user) => {
        const member = message.guild.member(user)
        
        function canModify(member) {
          if (member.voice.channel.id !== serverQueue.voiceChannel.id) return false; else return true;
        }
        
        switch(reaction.emoji.name) {
          case "🗑️": 
            
            reaction.users.remove(user)
            
            m.delete()
             
            break;
            
          
          case "🔀": 
            
            reaction.users.remove(user);
            
            if (!canModify(member)) return message.member.send(`You cannot use this react!\n${m.url}`)
            
            let EnableOrDisable = serverQueue.shuffle ? true : false;
            
            let _enable;
            
            if (EnableOrDisable) _enable = false;
            if (!EnableOrDisable) _enable = true;
            
            serverQueue.shuffle = _enable;
            
            serverQueue.textChannel.send(`Server option for shuffle has been turn **${serverQueue.shuffle ? "On" : "Off"}** ! c:`).then(m2 => m2.delete({
              timeout: 5000
            }))            
            
            break;
            
          case "🔁":
            
            reaction.users.remove(user);
            
            if (!canModify(member)) return message.channel.send(`You cannot use this react!\n${m.url}`)
            
            let loop = serverQueue.loop ? true : false;
            
            let _loop;
            
            if (loop) _loop = false;
            if (!loop) _loop = true;
            
            serverQueue.loop = _loop;
            
            serverQueue.textChannel.send(`Server option for loop has been turn **${serverQueue.loop ? "On" : "Off"}** ! \:D`).then(m2 => {
              m2.delete({
                timeout: 5000
              })
            })
            
            break;
            
          case "⏭️":
            
            reaction.users.remove(user);
            
            if (!canModify(member)) return message.member.send(`You cannot use this react!\n${m.url}`)
            
            if (user.id !== serverQueue.songs[0].user.id) return message.channel.send(`Oops **${user.tag}**, you cant use this react! if want to skip music, use **${config.prefix}vote-skip** command \:D`).then(m2 => m2.delete({
              timeout: 5000
            }))
            
             serverQueue.connection.dispatcher.end(); 
            
            serverQueue.textChannel.send(`**${user.tag}** skip the song :>`).then(m2 => m2.delete({
              timeout: 5000
            }))
            
            if (!serverQueue.songs[0]) return serverQueue.connection.dispatcher.end();
            
            break;
            
          case "⏯️":
            
            reaction.users.remove(user);
            
            if (!canModify(member)) return message.member.send(`You cannot use this react!\n${m.url}`);
            
            let playing = serverQueue.playing ? true : false;
            
            if (!playing) {
              serverQueue.playing = true;
              serverQueue.connection.dispatcher.resume();
            }
            if (playing) {
              serverQueue.playing = false;
              serverQueue.connection.dispatcher.pause();
            }
            
            return serverQueue.textChannel.send(`Succesfully **${serverQueue.playing ? "Resume" : "Pause"}** **${serverQueue.songs[0].title}** - <@${serverQueue.songs[0].user.id}>`).then(m2 => {
              m2.delete({
                timeout: 5000
              })
            })
            
            break;
            
          case "🔈":
            
            reaction.users.remove(user);
            
            if (!canModify(member)) return message.member.send(`You cannot use this react!\n${m.url}`)
            
            let mute = false;
            
            if (serverQueue.volume <= 0) {
              serverQueue.volume = 100;
              mute = false;
              serverQueue.connection.dispatcher.setVolume(100 / 100)
            } else {
              serverQueue.volume = 0;
              mute = true;
              serverQueue.connection.dispatcher.setVolume(0);
            }
            
            return serverQueue.textChannel.send(`Succesfully **${mute ? "Mute" : "Unmute"}** **${serverQueue.songs[0].title}** - <@${serverQueue.songs[0].user.id}>`).then(m2 => {
              m2.delete({
                timeout: 5000
              })
            })
            
            break;
        }
        
      })
   
      
    })
} 