const db = require('quick.db');

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Wow, looks like you do not have **Manage Guild** permission!`);
  
    message.guild.channels.create('JFC', {
      type: 'category'
    }).then(c => {
      c.setPosition(0)
      message.guild.channels.create(`✏️ Manage JFC`, {
        type: 'text',
        topic: `Manage your voice channel here! - ${config.prefix}help voice`
      }).then(c2 => {
        c2.setParent(c.id)
      })
      
      message.guild.channels.create("➕ Join For Create", {
        type: 'voice',
        userLimit: 1
      }).then(c1 => {
        c1.setParent(c.id)
        db.set(`jfc.${message.guild.id}`, c1.id)
        
        return message.channel.send(`Join for create channel has been created! now you can change the voice channel, text channe & category name!`)
      })
    })  
  
}

exports.config = {
  name: "join-to-create",
  description: "Setup join to create",
  aliases: ["jtc"],
  cooldown: 10
}