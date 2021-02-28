exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {
  
  if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Hey, please contact **${message.guild.id}** admin to give you **Manage Guild** permission!`);
  
  let msg = await message.channel.send(`React with ↪️ for **turn on or turn off autoplay**`);
  
  let filter = (reaction, user) => user.id !== client.user.id && }
  
}

exports.config = {
  name: "autoplay",
  description: "Turn on / off server autoplay",
  aliases: ["ap"],
  cooldown: 10
}