const db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let jtc = await db.get(`jfc.${message.guild.id}`);
  if (!jtc) return message.channel.send(`This server do not setup join-to-create!`);
  
  let voiceChannel = message.member.voice.channel;
  
  if (!voiceChannel) return message.channel.send(`Please join **${message.guild.channels.cache.get(jtc).name}** to create your own voice`)
  
}

exports.config = {
  name: "lock",
  description: "Lock your voice channel",
  aliases: ["lock-vc"],
  cooldown: 10
}