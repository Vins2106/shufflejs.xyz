exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  message.channel.send(`https://discord.com/oauth2/authorize?client_id=814371759264235560&scope=bot&permissions=2146827775`)
  
}

exports.config = {
  name: "invite",
  description: "Invite me to your server!",
  aliases: ["invite-bot", "ib"],
  cooldown: 10
}