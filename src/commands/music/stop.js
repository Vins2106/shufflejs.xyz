exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  let queue = music.get(message.guild.id);
  
  if (!message.member.voice.channel) return message.channel.send(`Uh! Please join voice channel bro... >:(`)
  
  if (!queue) return message.channel.send(`This server do not play music bro...`)
  
  if (message.member.voice.channel.id !== queue.voiceChannel.id) return message.channel.send(`Bro, you must join **${queue.voiceChannel.name}** >:c`)
  
  
  if (queue.voiceChannel.members.size - 1 > 2) {
  let _vote = Math.ceil(queue.voiceChannel.members.size - 1 / 2)
  let _votes = 0;
  
    let m = await message.channel.send(`Timeout: **30s**\nWe need **${_vote}** votes to stop music\nreact with 📢`);
    
    m.react("📢");
    
    let filter = (reaction, user) => user.id !== client.user.id;
    let collector = m.createReactionCollector(filter, {time: 30 * 1000});
    
    collector.on("collect", (reaction, user) => {
      
      switch (reaction.emoji.name) {
          
        case "📢":
          
          
          
          _votes = _votes + 1;
          
          if (_votes > _vote)
          
          m.edit(`Someone voted, now on **${_votes}/${_vote}**, need **${_vote - _votes}** more!`)
          
          break;
          
      }
      
    });
    
    collector.on("remove", (reaction, user) => {
      
      switch (reaction.emoji.name) {
          
        case "📢":
          
          _votes = _votes - 1;
          
          m.edit(`Someone unvote, now on **${_votes}/${_vote}**, need **${_vote - _votes}** more!`)
          
          break;
          
      }
      
    });
    
    collector.on("end", (collect) => {
      
      
      
    })
  }
  
}

exports.config = {
  name: "stop",
  description: "Stop server songs with voting system!",
  aliases: ["stop-music", "stop-song"],
  cooldown: 10
}