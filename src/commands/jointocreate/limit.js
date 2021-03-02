let db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let userData = await db.get(`jfc.${message.author.id}`);
  let guildData = await db.get(`jfc.${message.guild.id}`);
  
  if (!guildData) return message.channel.send(`This server do not set join to create!`)
  
  let voiceChannel = message.member.voice.channel;
  
  if (!voiceChannel) return message.channel.send(`Please join **${client.channels.cache.get(guildData).name}** to create your own voice channel!!`)
  
  if (!userData.joined) return message.channel.send(`Please join **${client.channels.cache.get(guildData).name}** to create your own voice channel!`);
  
  if (voiceChannel.id !== userData.voice.id) return message.channel.send(`Bro, you must create your own voice, or claim this voice using **${config.prefix}claim**`);
  
  let limit = args[0];
  if (!limit) return message.channel.send(`Please provide limit! e.g 2`);
  if (isNaN(limit)) return message.channel.send(`The limit must be a number!`)
  if (limit > 99) limit = 99;
  
  let vc = client.channels.cache.get(voiceChannel.id) || await client.channels.fetch(voiceChannel.id);
  
  vc.edit({userLimit: limit});
  
  return message.channel.send(`You voice channel (**${voiceChannel.name}**) limit has been set to **${limit}**`)
  
}

exports.config = {
  name: "voice-limit",
  description: "",
  aliases: ["limit", "vl"],
  cooldown: 10
}