exports.run = async (message, client, args, music, config) => {
  
  if (!music.get(message.guild.id)) return message.channel.send(`This server do not have current music :<`);
  
  const queueE = new Discord
  
}

exports.config = {
  name: "queue",
  description: "View server queue",
  aliases: ["q", "server-queue", "sq"],
  cooldown: 10
}