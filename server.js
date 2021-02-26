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
  
  command.run(message, client, args, config, handleVideo, play, youtube, url)
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
        user: message.author
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            playing: true,
            loop: false
        };
        music.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join()
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
            
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

function play(guild, song) {
    const serverQueue = music.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        return music.delete(guild.id);
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
        .on("finish", () => {
            const shiffed = serverQueue.songs.shift();
            if (serverQueue.loop === true) {
                serverQueue.songs.push(shiffed);
            };
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolume(serverQueue.volume / 100);

    serverQueue.textChannel.send(new Discord.MessageEmbed().setAuthor("Now playing").setColor(config.embed).setDescription(`**${song.title}** - **${song.duration.hours}** : **${song.duration.minutes}** : **${song.duration.seconds}**`).setImage(song.thumbnail.url).setFooter(`${song.url}`)).then(m => {
      
      m.react("🗑️");
      
      const filter = (reaction, user) => user.id !== client.user.id;
      var collector = m.createReactionCollector(filter)
      
      collector.on("collect", async (reaction, user) => {
        
        switch(reaction.emoji.name) {
          case "🗑️": 
            
            m.delete()
            
            break;
        }
        
      })
      
      
    })
}