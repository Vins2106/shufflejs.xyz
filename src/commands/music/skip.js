exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  let queue = music.get(message.guild.id);
  
  if (!queue) return message.channel.send(`This server do not play music \:(`)
  
  if (!message.member.voice.channel) return message.channel.send(`Hey, please join voice channel!`)
  
  if (message.member.voice.channel.id !== queue.voiceChannel.id) return message.channel.send(`Bro, you must join **${queue.voiceChannel.name}** >:c`)
  
  if (message.member.hasPermission("ADMINISTRATOR")) {
    queue.connection.dispatcher.end();
    
    return message.channel.send(`**${message.author.tag}** have **Administrator** permission, so he do not need to vote, skipped by admin!`)
  }
  
  let _withoutBots = 0;
  
    queue.voiceChannel.members.map(x => {
      if (x.user.bot) return;
      _withoutBots = _withoutBots + 1
    })
  
  
  if (_withoutBots > 1) {
  
    
  let _vote = _withoutBots
  let _votes = 0;
  let _deleted = false;
  let _url;
    
    let m = await message.channel.send(`Timeout: **30s**\nWe need **${_vote}** votes to skip music\nreact with 📢`);
    
    m.react("📢");
    
    let filter = (reaction, user) => user.id !== client.user.id;
    let collector = m.createReactionCollector(filter, {dispose: true, time: 30 * 1000});
    
    collector.on("collect", async (reaction, user) => {
      
      switch (reaction.emoji.name) {
          
        case "📢":
          
          
          
          _votes = _votes + 1;
          
          if (_votes == _vote) {
            queue.connection.dispatcher.end();
            
            _deleted = true;
            
            let m2 = await message.channel.send(`Succesfully to skip music :D`)
            
            return _url = m2.url;
          }
          
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
      
      if (_deleted) {
        m.edit(`Succesfully skip music\n${_url}`)
      } else {
        m.edit(`Cancel to skip music`)
      }
      
    })
  } else {
    
    queue.songs = [];
    
    if (queue.autoplay) {
      queue.stopped = true;
    }
    
    queue.connection.dispatcher.end();
    
    message.channel.send(`Stopped music!`).then(m2 => {
      m2.delete({
        timeout: 5000
      })
    })
    
  }  
}

exports.config = {
  name: "",
  description: "",
  aliases: [],
  cooldown: 10
}