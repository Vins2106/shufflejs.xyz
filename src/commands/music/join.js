exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  if (message.guild.me.voice.channel) return message.channel.send(`Im currently join \`${message.guild.me.voice.channel.name}\` with:\n${message.guild.me.voice.channel.members.map(x => `**${x.user.username}**`).join(", ")}`)
  
  let queue = music.get(message.guild.id);
  if (queue) return message.channel.send(`Im currently playing on \`${queue.voiceChannel.name}\``);
  
  let voiceChannel = message.member.voice.channel;
  
  if (!voiceChannel) return message.channel.send(`Please join voice channel first!`);
  
  let _joinAble = await voiceChannel.join()
  
  _joinAble.voice.setSelfDeaf(true) 
  client.voices.set(message.author.id, message.author);
  
  return message.channel.send(`Joined \`${voiceChannel.name}\` !`)
  
}

exports.config = {
  name: "join",
  description: "Join voice channel for you :D",
  aliases: ["join-voice", "jv"],
  cooldown: 10
}