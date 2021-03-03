const db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let jtc = await db.get(`jfc.${message.guild.id}`);
  if (!jtc) return message.channel.send(`This server do not setup join-to-create!`);
  
  let voiceChannel = message.member.voice.channel;
  
  if (!voiceChannel) return message.channel.send(`Please join **${message.guild.channels.cache.get(jtc).name}** to create your own voice`)
  
  let userData = await db.get(`jfc.${message.author.id}.voice`);
  
  if (!userData) return message.channel.send(`Please create your own voice channel!`);
  
  if (userData.id !== voiceChannel.id) return message.channel.send(`This is not your voice channel!`)
  
  let chl = client.channels.cache.get(userData.id) || await client.channels.fetch(userData.id);
  
  let check = await db.get(`lock.${voiceChannel.id}`);
  if (!check) return message.channel.send(`You voice do not locked!`)
  
  chl.edit({userLimit: 0});
  
  db.set(`lock.${voiceChannel.id}`, false);
  
  return message.channel.send(`Succesfully unlock your voice channel!`);
  
}

exports.config = {
  name: "unlock",
  description: "Unlock your voice channel",
  aliases: ["unlock-vc"],
  cooldown: 10
}