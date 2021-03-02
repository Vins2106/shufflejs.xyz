exports.run = async (message, client, args, music, config, handleVideo, play, youtube, url) => {

  if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`Sorry, you need **Manage Guild** permission`);
  
  if (!args[0]) {
    return message.channel.send(`Missing argument:
**${config.prefix}join-to-create <#channel>**`)
  }
  
}

exports.config = {
  name: "join-to-create",
  description: "Set join to create voice channel",
  aliases: ["jtc", "jointocreate"],
  cooldown: 10
}