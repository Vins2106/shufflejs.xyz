const config = require("../../config.js");

async function createReactionMusic(m, song, message, client, serverQueue) {
      const filter = (reaction, user) => user.id !== client.user.id;
      let _time1 = song.duration.hours * 3600000;
      let _time2 = song.duration.minutes * 60000;
      let _time3 = song.duration.seconds * 1000;
      let time = _time1 + _time2 + _time3;
      
      var collector = m.createReactionCollector(filter, {time: time})
      
      collector.on("collect", async (reaction, user) => {
        const member = message.guild.member(user)
        
        function canModify(member) {
          if (member.voice.channel.id !== serverQueue.voiceChannel.id) return false; else return true;
        }
        
        switch(reaction.emoji.name) {
          case "🗑️": 
            
            reaction.users.remove(user)
            
            m.delete()
             
            
            break;
            
          case "🔁":
            
            reaction.users.remove(user);
            
            if (!canModify(member)) return message.channel.send(`You cannot use this react!\n${m.url}`)
            
            let loop = serverQueue.loop ? true : false;
            
            let _loop;
            
            if (loop) _loop = false;
            if (!loop) _loop = true;
            
            serverQueue.loop = _loop;
            
            serverQueue.textChannel.send(`Server option for loop has been turn **${serverQueue.loop ? "On" : "Off"}** ! \:D`).then(m2 => {
              m2.delete({
                timeout: 5000
              })
            })
            
            break;
            
          case "⏭️":
            
            reaction.users.remove(user);
            
            if (!canModify(member)) return message.member.send(`You cannot use this react!\n${m.url}`)
            
            if (user.id !== serverQueue.songs[0].user.id) return message.channel.send(`Oops **${user.tag}**, you cant use this react! if want to skip music, use **${config.prefix}vote-skip** command \:D`).then(m2 => m2.delete({
              timeout: 5000
            }))
            
             serverQueue.connection.dispatcher.end(); 
            
            serverQueue.textChannel.send(`**${user.tag}** skip the song :>`).then(m2 => m2.delete({
              timeout: 5000
            }))
            
            if (!serverQueue.songs[0]) return serverQueue.connection.dispatcher.end();
            
            break;
            
          case "⏯️":
            
            reaction.users.remove(user);
            
            if (!canModify(member)) return message.member.send(`You cannot use this react!\n${m.url}`);
            
            let playing = serverQueue.playing ? true : false;
            
            if (!playing) {
              serverQueue.playing = true;
              serverQueue.connection.dispatcher.resume();
            }
            if (playing) {
              serverQueue.playing = false;
              serverQueue.connection.dispatcher.pause();
            }
            
            return serverQueue.textChannel.send(`Succesfully **${serverQueue.playing ? "Resume" : "Pause"}** **${serverQueue.songs[0].title}** - <@${serverQueue.songs[0].user.id}>`).then(m2 => {
              m2.delete({
                timeout: 5000
              })
            })
            
            break;
            
          case "🔈":
            
            reaction.users.remove(user);
            
            if (!canModify(member)) return message.member.send(`You cannot use this react!\n${m.url}`)
            
            let mute = false;
            
            if (serverQueue.volume <= 0) {
              serverQueue.volume = 100;
              mute = false;
              serverQueue.connection.dispatcher.setVolume(100 / 100)
            } else {
              serverQueue.volume = 0;
              mute = true;
              serverQueue.connection.dispatcher.setVolume(0);
            }
            
            return serverQueue.textChannel.send(`Succesfully **${mute ? "Mute" : "Unmute"}** **${serverQueue.songs[0].title}** - <@${serverQueue.songs[0].user.id}>`).then(m2 => {
              m2.delete({
                timeout: 5000
              })
            })
            
            break;
            
          case "🔉":
            
            reaction.users.remove(user);
            
            if (serverQueue.volume == 0) return;
            if (serverQueue.volume - 10 <= 0) serverQueue.volume = 0; else serverQueue.volume = serverQueue.volume - 10;
            
            serverQueue.connection.dispatcher.setVolume(serverQueue.volume / 100);
            
            message.channel.send(`The volume now on **${serverQueue.volume}%**`).then(m2 => {
              m2.delete({
                timeout: 5000
              })
            })
            
            break;
            
          case "🔊": 
         
            reaction.users.remove(user);
            
            if (serverQueue.volume == 100) return;
            if (serverQueue.volume + 10 >= 100) serverQueue.volume = 100; else serverQueue.volume = serverQueue.volume + 10;
            
            serverQueue.connection.dispatcher.setVolume(serverQueue.volume / 100);
            
            message.channel.send(`The volume now on **${serverQueue.volume}%**`).then(m2 => {
              m2.delete({
                timeout: 5000
              })
            })            
            
            break;
        }
        
      })
   
      collector.on("end", async collector => {
        m.delete()
      })  
}

module.exports = {createReactionMusic}