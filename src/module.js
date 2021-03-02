module.exports = async (client, fs) => {
  fs.readdir('./src/commands/', async (err, category) => {
    category.forEach(cat => {
      let moduleConfig = require(`./commands/${cat}/module.json`);
      
      client.modules.set(moduleConfig.name, moduleConfig);
      if (!moduleConfig) return;
      
      fs.readdir(`./src/commands/${cat}`, async (err, commands) => {
        
        commands.forEach(cmd => {
          
          if (!cmd.endsWith('.js')) return;
          
          let commandConfig = require(`./commands/${cat}/${cmd}`);
          
          client.commands.set(commandConfig.config.name, commandConfig)
          
          commandConfig.config.aliases.forEach(a => {
            client.aliases.set(a, commandConfig.config.name)
          });
          
          client.modules.get(cat).cmds.push(commandConfig.config)
        })
      })
    })
  });
}