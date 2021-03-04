exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let botVC = message.guild.me.voice.channel;
  let userVC = message.member.voice.channel;
  let queue = music.get(message.guild.id);
  
  if (botVC) return message.channel.send(`Im currently join \`${botVC.name}\` with:\n${botVC.members.map(x => `**${x.user.username}**`).join(", ")}`);
  if (queue) return message.channel.send(`Im currently playing music in \`${queue.voiceChannel.name}\``)
  if (!userVC) return message.channel.send(`Please join voice channel!`);
  if (botVC.id !== userVC) return message.channel.send(`You need to join same voice channel as ${client.user.username} !`)
  
  if (userVC.members.length < 2) {
    botVC.leave();
    
    return message.channel.send(`Succesfully disconnect!`)
  } else {
  let getUser = client.voice.get(message.author.id);
  
  if (getUser || message.member.hasPermission("MANAGE_CHANNELS")) {
    botVC.leave();
    
    return message.channel.send(`Succesfully disconnect!`)
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