let db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  let jtc = db.get(`jfc.${message.guild.id}`);
  
  if (!jtc) return message.channel.send(`Please tell the admin to setup join-to-create first`);
  
  let voiceChannel = message.member.voice.channel;
  
  let jtcChl = client.channels.cache.get(jtc) || await client.channels.fetch(jtc);
  
  if (!voiceChannel) return message.channel.send(`Please join **${jtcChl.name}** to create your own voice channel!`);
  
  let getChl = await db.get(`tempvoicechannel_${message.guild.id}_${voiceChannel.id}`);
  
  if (!getChl) return message.channel.send(`This is not join-to-create voice channel, please make your own!`);
  
  let getUserVC = await db.get(`jfc.${message.author.id}.voice`);
  if (getUserVC.id == voiceChannel.id) {
    return message.channel.send(`This is your own voice channel, you cannot claim!`)
  } else {
    
  let getOwner = db.get(`ownerJFC.${voiceChannel.id}`);
  
    
  db.set(`jfc.${message.author.id}.voice`, voiceChannel);
  db.set(`jfc.${message.author.id}.joined`, true);
  
  let userVN = await db.get(`jfc.${message.author.id}.name`);
  if (userVN) {
    voiceChannel.edit({name: userVN});
  } else if (!userVN) {
    voiceChannel.edit({name: `🔊 - ${message.author.username} Voice`})
  }
  
  return message.channel.send(`Succesfully claim this voice channel, now this voice channel is your own! :>`);
  
  }
  
}

exports.config = { 
  name: "claim",
  description: "Claim a voice channel",
  aliases: ["claim-voice"],
  cooldown: 10
}