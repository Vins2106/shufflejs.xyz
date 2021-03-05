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
  if (getUserVC) {
    if (getUserVC.id == voiceChannel.id) { 
    return message.channel.send(`This is your own voice channel, you cannot claim!`)
    }
  }
  let getOwner = await db.get(`ownerJFC.${voiceChannel.id}`);
  
  let voiceCM = [];
  
  voiceChannel.members.map(x => {
    voiceCM.push(x.id);
  });
    
  if (message.author.id == getOwner.id) {    
  db.set(`jfc.${message.author.id}.voice`, voiceChannel);
  db.set(`jfc.${message.author.id}.joined`, true);
  
  let userVN = await db.get(`jfc.${message.author.id}.name`);
  if (userVN) {
    voiceChannel.edit({name: userVN});
  } else if (!userVN) {
    voiceChannel.edit({name: `🔊 - ${message.author.username} Voice`})
  }
  
  let check = message.guild.members.cache.get(getOwner.id).voice.channel;
  if (!check) {
    db.delete(`jfc.${getOwner.id}.voice`)
  } else if (check) {
    
    if (check.id == voiceChannel.id) {
      db.delete(`jfc.${getOwner.id}.voice`);
    }
    
    if (!db.get(`tempvoicechannel_${message.guild.id}_${check.id}`)) {
      db.delete(`jfc.${getOwner.id}.voice`)
    } else {
      db.set(`jfc.${getOwner.id}.voice`, check)
    }
    
  }
  
  return message.channel.send(`Succesfully claim this voice channel, now this voice channel is your own! :>`);    
  }
  
//   
  
  if (voiceCM.includes(getOwner.id)) {
    return message.channel.send(`You cannot claim this voice, the owner on this voice!`)
  }
  
  
  let userVN = await db.get(`jfc.${message.author.id}.name`);
  if (userVN) {
    voiceChannel.edit({name: userVN});
  } else if (!userVN) {
    voiceChannel.edit({name: `🔊 - ${message.author.username} Voice`})
  }
  
  let check = message.guild.members.cache.get(getOwner.id).voice.channel;
  if (!check) {
    db.delete(`jfc.${getOwner.id}.voice`)
  } else if (check) {
    
    if (check.id == voiceChannel.id) {
      db.delete(`jfc.${getOwner.id}.voice`);
    }
    
    if (!db.get(`tempvoicechannel_${message.guild.id}_${check.id}`)) {
      db.delete(`jfc.${getOwner.id}.voice`)
    } else {
      db.set(`jfc.${getOwner.id}.voice`, check)
    }
    
  }
  db.set(`jfc.${message.author.id}.voice`, voiceChannel);
  db.set(`jfc.${message.author.id}.joined`, true);
  
  return message.channel.send(`Succesfully claim this voice channel, now this voice channel is your own! :>`);
  
  
  
}

exports.config = { 
  name: "claim",
  description: "Claim a voice channel",
  aliases: ["claim-voice"],
  cooldown: 10
}