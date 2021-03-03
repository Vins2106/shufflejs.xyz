const db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let jtc = await db.get(`jfc.${message.guild.id}`);
  if (!jtc) return message.channel.send(`This server do not setup join-to-create!`);
  
  let voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send(`Please join **${client.channels.cache.get(jtc).name}** first! to create your own voice channel!`);
  
  let getUserVC = await db.get(`jfc.${message.author.id}.voice`);
  
  if (!getUserVC) return message.channel.send(`Please create voice channel first!`);
  
  if (getUserVC.id !== voiceChannel.id) return message.channel.send(`This is not your own voice channel!`);
  
  let newName = args.join(" ");
  
  if (!newName) return message.channel.send(`Please provide new voice name!`);
  
  if (newName.length < 1) return message.channel.send(`The voice channel name must be between 1 and 24 characters`);
  
  if (newName.length > 24) return message.channel.send(`The voice channel name must be between 1 and 24 characters`);
  
  db.set(`jfc.${message.author.id}.name`, newName);
  
  voiceChannel.edit({
    name: newName
  });
  
  return message.channel.send(`Your voice channel name has been set to **${newName}**`)
  
}

exports.config = {
  name: "name",
  description: "Set your voice name!",
  aliases: ["voice-name", "vn"],
  cooldown: 10
}