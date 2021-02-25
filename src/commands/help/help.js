exports.run = async (message, client, args, config) => {
  
  if (client.modules.get(args[0])) {
    let mod = client.modules.get(args[0]);
    
    const cmdE = new client.embed()
    .setAuthor(`${mod.emoji} - ${mod.name}`)
    .setColor(config.embed)
    .setFooter("UwU!")
    
    mod.cmds.forEach(cmd => {
      cmdE.addField(`${cmd.name} - ${cmd.cooldown}`, `\n\n**[${cmd.aliases.join(", ")}]**\n**${cmd.description}**`, true)
    });
    
    return message.channel.send(cmdE)
  } else if(client.commands.has(args[0]) || client.commands.get(client.aliases.get(args[0]))) {
    let cmd 
  }
  
  const helpE = new client.embed()
  .setAuthor(client.user.username + "", client.user.displayAvatarURL())
  .setDescription("Holla!")
  .setColor(config.embed)
  .setFooter(`${config.prefix}help [category]`)
  
  client.modules.forEach(cat => {
    helpE.addField(`${cat.emoji} - ${cat.name}`, `**${cat.description}**`, true)
  });
  
  message.channel.send(helpE)
  
}

exports.config = {
  name: "help",
  description: "Show all commands",
  aliases: ["h", "cmds", "cmdslist"],
  cooldown: 10
}