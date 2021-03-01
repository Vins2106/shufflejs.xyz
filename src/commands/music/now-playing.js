const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let queue = music.get(message.guild.id);
  
  if (!queue) return message.channel.send(`This server do not play music, play first! **${config.prefix}play [song]**`)
  
  let song = queue.songs[0];
  
  const npE = new MessageEmbed()
  .setAuthor(`Playing music by - ${song.user.username}`)
  .setDescription(`**${song.title}** - **${song.duration.hours}** : **${song.duration.minutes}** : **${song.duration.seconds}**`)
  .setImage(song.thumbnail.url)
  .setColor(config.embed)
  .setFooter(`${song.url}`)
  
  const msg = await message.channel.send(npE);
  
      msg.react("🔁");
      msg.react("⏭️");
      msg.react("⏯️");
      msg.react("🔈");
      msg.react("🔉");
      msg.react("🔊");
      msg.react("🗑️");
      
      const { createReactionMusic } = require("../../reaction/play.js");
      
      createReactionMusic(msg, song, message, client, queue);
  
}

exports.config = {
  name: "now-playing",
  description: "Show this server now playing song!",
  aliases: ["np"],
  cooldown: 10
}