exports.run = async (message, client, args, config) => {
  
  if (client.modules.get(args[0])) {
    let mod = client.modules.get(args[0]);
    
    const cmdE = new client.embed()
    .setAuthor(`${mod.emoji} - ${mod.name}`)
    .setColor(config.embed)
    .setFooter("UwU!")
    
    mod.cmds.forEach(cmd => {
      cmdE.addField(`${cmd.name} - ${cmd.cooldown}`, `**[${cmd.aliases.map(a => `\`${a}\``).join(", ")}]**`)
    });
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
  description: "",
  aliases: ["h", "cmds", "cmdslist"],
  cooldown: 10
}