let db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  let jtc = db.get(`jfc.${message.guild.id}`);
  
  if (!jtc) return message.channel.send(`Please tell the admin to setup join-to-create first`);
  
  let voiceChannel = message.member.voice.channel;
  
  let jtcChl = client.channels.cache.get(jtc) || await client.channels.fetch(jtc);
  
  if (!voiceChannel) return message.channel.send(`Please join **${jtcChl.name}** to create your own voice channel!`);
  
  let getChl = await db.get(`tempvoicechannel_${message.guild.id}_${voiceChannel.id}`);
  
  if (!getChl) return message.channel.send(``)
  
}

exports.config = {
  name: "claim",
  description: "Claim a voice channel",
  aliases: ["claim-voice"],
  cooldown: 10
}