exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Hey, please contact **${message.guild.id}** admin to give you **Manage Guild** permission!`);
  
  if (!music.get(message.guild.id)) return message.channel.send(`Please play a music first!`)
  
  let msg = await message.channel.send(`React with ↪️ for **turn on or turn off autoplay**`);
  
  msg.react("↪️");
  
  let filter = (reaction, user) => user.id !== client.user.id && user.id == message.author.id;
  
  let collector = msg.createReactionCollector(filter, {time: 30000});
  
  collector.on("collect", async (reaction, user) => {
    
    switch (reaction.emoji.name) {
        
      case "↪️":
        
        reaction.users.remove(user);
        
        let _enable = music.get(message.guild.id).autoplay ? true : false;
        let _conf = _enable;
        
        
        if (_enable) {
          _conf = false;
        } else if (!_enable) {
          _conf = true;
        }
        
        music.get(message.guild.id).autoplay = _conf;
        
        msg.delete();
        
        return message.channel.send(`Autoplay has been turn **${music.get(message.guild.id).autoplay ? "on" : "off"}**!`);
        
        break;
        
    }
    
  })
  
}

exports.config = {
  name: "autoplay",
  description: "Turn on / off server autoplay",
  aliases: ["ap"],
  cooldown: 10
}