exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  let jtc = 
  
  if (!message.member.voice.channel) return message.channel.send(`Please join`)
  
}

exports.config = {
  name: "claim",
  description: "Claim a voice channel",
  aliases: ["claim-voice"],
  cooldown: 10
}