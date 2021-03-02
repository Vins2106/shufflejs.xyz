const db = require('quick.db');
const ms = require('parse-ms')

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Wow, looks like you do not have **Manage Guild** permission!`);
  
    let pad_zero = num => (num < 10 ? '0' : '') + num;
    let cooldown = 100000;
    let lastCreate = db.get(`lastc.${message.guild.id}`);
        
        if (lastCreate !== null && cooldown - (Date.now() - lastCreate) > 0) {
            let timeObj = ms(cooldown - (Date.now() - lastCreate));

       
                let mins = pad_zero(timeObj.minutes).padStart(2, "0"),
                secs = pad_zero(timeObj.seconds).padStart(2, "0");

            let finalTime = `**${mins}:${secs}**`;
            return message.channel.send(`Oops! this server have cooldown to setup join-to-create! ${finalTime}`);
          
        } else { 
    message.guild.channels.create('JFC', {
      type: 'category'
    }).then(c => {
      db.set(`jfcCat.${message.guild.id}`, c.id)
      c.setPosition(0)
      message.guild.channels.create(`✏️ Manage JFC`, {
        type: 'text',
        topic: `Manage your voice channel here! - ${config.prefix}help voice`
      }).then(c2 => {
        c2.setParent(c.id)
      })
      
      message.guild.channels.create("➕ Join To Create", {
        type: 'voice',
        userLimit: 1
      }).then(c1 => {
        c1.setParent(c.id)
        db.set(`jfc.${message.guild.id}`, c1.id)
        
        return message.channel.send(`Join for create channel has been created! now you can change the voice channel, text channe & category name!`)
      })
    })  
  
          db.set(`lastc.${message.guild.id}`, Date.now())
          
        }  
}

exports.config = {
  name: "join-to-create",
  description: "Setup join to create",
  aliases: ["jtc"],
  cooldown: 10
}