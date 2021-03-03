const db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let jtc = await db.get(`jfc.${message.guild.id}`);
  if (!jtc) return message.channel.send(`This server do not setup join-to-create!`)
  
}

exports.config = {
  name: "name",
  description: "Set your voice name!",
  aliases: ["voice-name", "vn"],
  cooldown: 10
}