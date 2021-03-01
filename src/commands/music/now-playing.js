const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let queue = music.get(message.guild.id);
  let lastNpMsg = db.get(`lastnpmsg.${message.guild.id}`);
  if (lastNpMsg) {
    let msg = await client.message
  }
  
  if (!queue) return message.channel.send(`This server do not play music, play first! **${config.prefix}play [song]**`)
  
  let song = queue.songs[0];
  
  const npE = new MessageEmbed()
  .setAuthor(`Now playing - ${song.user.username}`)
  .setDescription(`**${song.title}** - **${song.duration.hours}** : **${song.duration.minutes}** : **${song.duration.seconds}**`)
  .setImage(song.thumbnail)
  .setColor(config.embed)
  .setFooter(`${song.url}`)
  
}

exports.config = {
  name: "now-playing",
  description: "Show this server now playing song!",
  aliases: ["np"],
  cooldown: 10
}