exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let userVC = message.member.voice.channel;
  let queue = music.get(message.guild.id);
  
  if (!message.guild.me.voice.channel) return message.channel.send(`I do not join any voice channel!`)
  if (queue) return message.channel.send(`Im currently playing music in \`${queue.voiceChannel.name}\``)
  if (!userVC) return message.channel.send(`Please join voice channel!`);
  if (message.guild.me.voice.channel.id !== userVC.id) return message.channel.send(`You need to join same voice channel as ${client.user.username} !`)
  
  if (userVC.members.length < 2) {
    userVC.leave();
    client.voices.delete(message.author.id)
    
    return message.channel.send(`Succesfully disconnect!`)
  } else {
  let getUser = client.voices.get(message.author.id);
  
  if (getUser || message.member.hasPermission("MANAGE_CHANNELS")) {
    let perms = false;
    if (getUser) {
      perms = false
    } else if (!getUser) {
      perms = true
    }
    userVC.leave();
    client.voices.delete(message.author.id)
    
    return message.channel.send(`Succesfully disconnect! ${perms ? "**Stopped by user with the person who has Manage Channels permission**" : ""}`)
  } else if (!getUser || !message.member.hasPermission("MANAGE_CHANNELS")) {
    return message.channel.send(`You are need **Manage Channels** permissions because you are not the one who told me to join this voice channel`)
  }    
  }
  
}

exports.config = {
  name: "disconnect",
  description: "Make me disconnect from voice channel!",
  aliases: ["dc", "leave"],
  cooldown: 10
}