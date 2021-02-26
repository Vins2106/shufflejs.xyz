exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  if (!music.get(message.guild.id)) return message.channel.send(`Uh, this server do not play any song >:c`)
  
  return message.channel.send(`The **${message.guild.name}** warn is **${music.get(message.guild.id).warn ? "GooD, the bot still on " : ""}**`)
  
}

exports.config = {
  name: "warn",
  description: "Check the warning (if bot on voice channel, the warn will ok)",
  aliases: ["w"],
  cooldown: 10
}