let db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Heyyyyy, you need **Manage Guild** permision bro >:c`)
  
  let volumeDB = db.get(`jfc.${message.guild.id}.volume`);
  if (!volumeDB) volumeDB = 100;
  
  let defaultVolume = args[0];
  
  if (!defaultVolume) return message.channel.send(`The current server volume is **${volumeDB}%**`);
  if (isNaN(defaultVolume)) return message.channel.send(`The volume must be a number!`);
  if (defaultVolume < 1 && defaultVolume > 100) return message.channel.send(`The new volume must be between 1 and 100!`);

  db.set(`jfc.${message.guild.id}.volume`, defaultVolume);
  
  message.channel.send(`The server default volume has been set to **${volumeDB}&** by admin!`);
  
  
}

exports.config = {
  name: "default-volume",
  description: "Set server default volume!",
  aliases: ["dv"],
  cooldown: 10
}