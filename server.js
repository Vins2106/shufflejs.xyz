const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: "everyone"
});

require("dotenv").config()

let config = require("./src/config/config.js");

require("./src/client/login.js")(Discord, client, config);
require("./src/handler/event.js")(client)