let db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let jtc = await db.get(`jfc.${message.guild.id}`);
  if (!jtc) return message.channel.send(`Please tell to admin to setup join-to-create first!`);
  
  let voiceChannel = message.member.voice.channel;
  
  if (!voiceChannel) return message.channel.send(`Please join **${client.channels.cache.get(jtc).name}** first to create your own voice channel!`);
  
  let getUserVC = await db.get(`jfc.${message.author.id}.voice`);
  
  if (voiceChannel.id !== getUserVC.id) return message.channel.send(`This is not your own voice channel, claim this voice to unreject user!`);
  
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]);
  if (!user) return message.channel.send(`Please mention or give user id!`)
  
  
  let getOwn = await db.get(`ownerJFC.${voiceChannel.id}`);
  
  if (user.id == getOwn.id) return message.channel.send(`This is voice owner, the owner do not reject!`)
  
  let _reject = await db.get(`reject.${voiceChannel.id}.${user.id}`);
  if (!_reject) return message.channel.send(`This user do not rejected from this voice!`)
  
  voiceChannel.overwritePermissions([
    {
      id: user.id,
      allow: ['VIEW_CHANNEL', 'CONNECT']
    }
  ]);
  
  message.channel.send(`<@${user.id}> You have been unreject from joining **${getUserVC.name}**!`);
  
  db.set(`reject.${voiceChannel.id}.${user.id}`, false)
  
  
}

exports.config = {
  name: "unreject",
  description: "Unreject user from voice channel!",
  aliases: ["un-rj", "unrj"],
  cooldown: 10
}