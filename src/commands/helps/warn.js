exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  if (!music.get(message.guild.id)) return message.channel.send(`Uh, this server do not play any song >:c`)
  
  const queue = music.get(message.guild.id);
  
  return message.channel.send(`The **${message.guild.name}** warn is **${queue.warn ? `GooD the bot still on \`${music.get(message.guild.id).voiceChannel.name}\`` : `Oh no, the bot is no longer leave from voice, make the bot join the voice again!`}**`)
  
}

exports.config = {
  name: "warn",
  description: "Check the warning (if bot on voice channel, the warn will ok)",
  aliases: ["w"],
  cooldown: 10
}