exports.run = async (message, client, args, config) => {
  
  let query = args[0];
  
  
  if (!query) {
    return message.channel.send(`The leaveOnEmpty plugin for this server is **${client.guildConfig.get(`config.${message.guild.id}.leaveOnEmpty`) ? "Enable" : "Disable"}**`)
  }
  
  if (query === "enable" || query === "on" || query === "true") {
    
  } else if (query === "disable" || query === "off" || query === "false") {
    
  } else {
    return message.channel.send(`>:c
enable:
${config.prefix}leave-on-empty enable
${config.prefix}leave-on-empty on
${config.prefix}leave-on-empty`)
  }
  
}

exports.config = {
  name: "leave-on-empty",
  description: "Turn on / turn off leaveOnEmpty plugin",
  aliases: ["loe", "plugin-loe", "p-loe", "ploe"],
  cooldown: 10
}