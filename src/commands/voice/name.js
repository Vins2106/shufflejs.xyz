const db = require("quick.db");
let ms = require("parse-ms");

exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  let jtc = await db.get(`jfc.${message.guild.id}`);
  if (!jtc) return message.channel.send(`This server do not setup join-to-create!`);
  
  
    let pad_zero = num => (num < 10 ? '0' : '') + num;
    let cooldown = 100000;
    let lastCreate = db.get(`lastCNM.${message.author.id}`);
        
        if (lastCreate !== null && cooldown - (Date.now() - lastCreate) > 0) {
            let timeObj = ms(cooldown - (Date.now() - lastCreate));

       
                let mins = pad_zero(timeObj.minutes).padStart(2, "0"),
                secs = pad_zero(timeObj.seconds).padStart(2, "0");

            let finalTime = `**${mins}:${secs}**`;
            return message.channel.send(`You cant change your voice channel name after ${finalTime}`);
          
        } else { 
  
  let voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send(`Please join **${client.channels.cache.get(jtc).name}** first! to create your own voice channel!`);
  
  let getUserVC = await db.get(`jfc.${message.author.id}.voice`);
  
  if (!getUserVC) return message.channel.send(`Please create voice channel first!`);
  
  if (getUserVC.id !== voiceChannel.id) return message.channel.send(`This is not your own voice channel!`);
  
  let newName = args.join(" ");
  
  if (!newName) return message.channel.send(`Please provide new voice name!`);
  
  if (newName.length < 1) return message.channel.send(`The voice channel name must be between 1 and 24 characters`);
  
  if (newName.length > 24) return message.channel.send(`The voice channel name must be between 1 and 24 characters`);
  
  db.set(`jfc.${message.author.id}.name`, newName);
  
  voiceChannel.edit({
    name: newName
  });
  
          db.set(`jfc.${message.author.id}`, voiceChannel)
          
          db.set(`lastCNM.${message.author.id}`, Date.now());
          
  return message.channel.send(`Your voice channel name has been set to **${newName}**`)
  
          
          
        }  
}

exports.config = {
  name: "name",
  description: "Set your voice name!",
  aliases: ["voice-name", "vn"],
  cooldown: 10
}