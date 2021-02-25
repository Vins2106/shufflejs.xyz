exports.run = async (message, client, args, config) => {
  
  const helpE = new client.embed()
  .setAuthor(client.user.username + "", client.user.displayAvatarURL())
  .setDescription("Holla!")
  .setColor(config.embed)
  
  client
  
}

exports.config = {
  name: "help",
  description: "",
  aliases: ["h", "cmds", "cmdslist"],
  cooldown: 10
}