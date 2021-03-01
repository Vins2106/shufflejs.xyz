const db = require("quick.db");

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
        
        let enable = db.get(`autoplay.${message.guild.id}`);
        if (!enable) {
          enable = true;
          db.set(`autoplay.${message.guild.id}`, true)
        }
        
        let _enable = enable ? true : false;
        
        let _conf;
        
        
        
        if (_enable) {
          _conf = false;
        } else if (!_enable) {
          _conf = true;
        }
        
        db.set(`autoplay.${message.guild.id}`, _conf)
        
        msg.delete();
        
        return message.channel.send(`Autoplay has been turn **${db.get(`autoplay.${message.guild.id}`) ? "on" : "off"}**!`);
        
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