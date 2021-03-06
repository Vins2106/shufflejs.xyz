exports.run = async (message, client, args, music, config)  => {
  
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`LOOKS LIKE YOU DO NOT HAVE **Manage Guild**`)
  
  let query = args[0];
  
  
  if (!query) {
    return message.channel.send(`The leaveOnEmpty plugin for this server is **${client.guildConfig.get(`config.${message.guild.id}.leaveOnEmpty`) ? "Enable" : "Disable"}**`)
  }
  
  let loe = client.guildConfig.get(`config.${message.guild.id}.leaveOnEmpty`);
  
  if (query === "enable" || query === "on" || query === "true") {
    if (loe) return message.channel.send("❎ - leaveOnEmpty already turn on! >:c")
    
    client.guildConfig.set(`config.${message.guild.id}.leaveOnEmpty`, true)
    
    return message.channel.send("✅ - Succesfully enable leaveOnEmpty \:D")
  } else if (query === "disable" || query === "off" || query === "false") {
    if (!loe) return message.channel.send("❎ - leaveOnEmpty already turn off! >:|")
    
    client.guildConfig.set(`config.${message.guild.id}.leaveOnEmpty`, false)
    
    return message.channel.send("✅ - Succesfully disable leaveOnEmpty \D:")    
  } else {
    return message.channel.send(`**>:c
enable:
${config.prefix}leave-on-empty enable
${config.prefix}leave-on-empty on
${config.prefix}leave-on-empty true

disable: 
${config.prefix}leave-on-empty disable
${config.prefix}leave-on-empty off
${config.prefix}leave-on-empty false**`)
  }
  
}

exports.config = {
  name: "leave-on-empty",
  description: "Turn on / turn off leaveOnEmpty plugin",
  aliases: ["loe", "plugin-loe", "p-loe", "ploe"],
  cooldown: 10
}