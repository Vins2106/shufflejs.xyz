const { MessageEmbed } = require('discord.js');

exports.run = async (message, client, args, music, config) => {
  
  if (!music.get(message.guild.id)) return message.channel.send(`This server do not have current music :<`);
  
  let queue = music.get(message.guild.id);
  
  let index = 0;
  
  let songs = queue.songs.slice(0, 10);
  
  const queueE = new MessageEmbed()
  .setAuthor(message.guild.name + " queue! c:", message.guild.iconURL())
  .setDescription(`Current: **${queue.songs[0].title}** - **${queue.songs[0].duration.hours}** : **${queue.songs[0].duration.minutes}** : **${queue.songs[0].duration.seconds}**
  
  ${songs.map(song => `**[${++index}.]** - **${song.title}** - **${song.duration.hours}** : **${song.duration.minutes}** : **${song.duration.seconds}**`).join("\n\n")}`)
  .setImage(queue.songs[0].thumbnail.url)
  .setColor(config.embed)
  .setFooter(`This songs from 1 - 10 in queue`)
  
  message.channel.send(queueE)
  
}

exports.config = {
  name: "queue",
  description: "View server queue",
  aliases: ["q", "server-queue", "sq"],
  cooldown: 10
}