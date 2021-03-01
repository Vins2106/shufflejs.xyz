const db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Hey, please contact **${message.guild.id}** admin to give you **Manage Guild** permission!`);
  
  
  let msg = await message.channel.send(`React with ↪️ for **turn on or turn off autoplay**`);
  
  msg.react("↪️");
  
  let filter = (reaction, user) => user.id !== client.user.id && user.id == message.author.id;
  
  let collector = msg.createReactionCollector(filter, {time: 30000});
  
  collector.on("collect", async (reaction, user) => {
    
    switch (reaction.emoji.name) {
        
      case "↪️":
        
        reaction.users.remove(user);
        
        let enable = db.get(`autoplay.${message.guild.id}`);
        let _enable;
        
        if (!enable) {
          _enable = true;
          db.set(`autoplay.${message.guild.id}`, true)
        } else {
        let _en = enable ? true : false;
        _enable = _en
        }
        
        let _conf;
        
        
        
        if (_enable) {
        db.set(`autoplay.${message.guild.id}`, false)
        _conf = false;
        msg.delete();
        return message.channel.send(`Autoplay has been turn **off**!`);
        } else if (!_enable) {
        db.set(`autoplay.${message.guild.id}`, true);
        _conf = true;
        msg.delete();
        return message.channel.send(`Autoplay has been turn **on**!`);
        }
        
        
        
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