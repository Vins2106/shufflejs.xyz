exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  message.channel.send(`https://shufflejs.xyz/support`)
  
}

exports.config = {
  name: "support",
  description: "Get bot server support link!",
  aliases: ["bot-support", "bs"],
  cooldown: 10
}