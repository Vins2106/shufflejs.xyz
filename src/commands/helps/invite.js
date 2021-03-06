exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  message.channel.send(`https://shufflejs.xyz/invite`)
  
}

exports.config = {
  name: "invite",
  description: "Invite me to your server!",
  aliases: ["invite-bot", "ib"],
  cooldown: 10
}