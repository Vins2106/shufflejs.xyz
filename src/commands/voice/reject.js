let db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let jtc = await db.get(`jfc.${message.guild.id}`);
  if (!jtc) return message.channel.send(`Please tell to admin to setup join-to-create first!`);
  
  let voiceChannel = message.member.voice.channel;
  
  if (!voiceChannel) return message.channel.send(`Please join **${client.channels.cache.get(jtc).name}** first to create your own voice channel!`);
  
  let getUserVC = await db.get(`jfc.${message.author.id}.voice`);
  
  if (voiceChannel.id !== getUserVC.id) return message.channel.send(`This is not your own voice channel, claim this voice to reject user!`);
  
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch();
  if (!user) return message.channel.send(`Please mention or give user id!`)
  
  let getOwn = await db.get(`ownerJFC.${voiceChannel.id}`);
  
  if (user.id == getOwn.id) return message.channel.send(`You cant reject voice owner!`)
  
  voiceChannel.overwritePermissions([
    {
      id: user.id,
      deny: ['VIEW_CHANNEL', 'CONNECT']
    }
  ]);
  
  
  
}

exports.config = {
  name: "reject",
  description: "Reject user from voice channel!",
  aliases: ["rj"],
  cooldown: 10
}