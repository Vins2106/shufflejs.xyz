exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  let queue = music.get(message.guild.id);
  
  if (!message.member.voice.channel) return message.channel.send(`Uh! Please join voice channel bro... >:(`)
  
  if (!queue) return message.channel.send(`This server do not play music bro...`)
  
  if (message.member.voice.channel.id !== queue.voiceChannel.id) return message.channel.send(`Bro, you must join **${queue.voiceChannel.name}** >:c`)
  
  
  if (queue.voiceChannel.members.size - 1 > 2) {
  let _vote = Math.ceil(queue.voiceChannel.members.size - 1 / 2)
    let m = await message.channel.send(`We need **${_vote}**`)
  }
  
}

exports.config = {
  name: "stop",
  description: "Stop server songs with voting system!",
  aliases: ["stop-music", "stop-song"],
  cooldown: 10
}