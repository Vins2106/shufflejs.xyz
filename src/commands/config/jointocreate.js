const db = require("quick.db");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Sorry, you need **Manage Guild** permission`);
  
    message.guild.channels.create('JTC', {
      type: 'category'
    }).then(c => {
      c.setPosition(0)
      message.guild.channels.create("➕ Join To Create", {
        type: 'voice',
        userLimit: 1
      }).then(c1 => {
        c1.setParent(c.id)
        db.set(`jfc.${message.guild.id}`, c1.id)
        return message.channel.send(`Succesfully create join-to-create voice channel! (**${c1.name}**)`)
      })
    });
  
  
}

exports.config = {
  name: "join-to-create",
  description: "Set join to create voice channel",
  aliases: ["jtc", "jointocreate"],
  cooldown: 10
}