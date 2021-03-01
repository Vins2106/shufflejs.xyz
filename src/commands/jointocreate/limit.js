let db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let userData = await db.get(`jfc.${message.autho}`)
  
}

exports.config = {
  name: "voice-limit",
  description: "",
  aliases: ["limit", "vl"],
  cooldown: 10
}