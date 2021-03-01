let db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let userData = await db.get(`jfc.${message.author.id}`);
  let guildData = await db.get(`jfc.${message.guild.id}`);
  
  if (!guildData) return message.channel.send(`This server do not set join to create!`)
  
  if (!userData.joined) return message.channel.send(`Please join **${client.channels.cache.get(guildData).name}** to create your own voice channel!`)
  
  let limit = args[0];
  if (!limit) return message.channel.send(`Please provide limit! e.g 2`);
  if (isNaN(limit)) return message.channel.send(`The limit must be a number!`)
  
  
  
}

exports.config = {
  name: "voice-limit",
  description: "",
  aliases: ["limit", "vl"],
  cooldown: 10
}