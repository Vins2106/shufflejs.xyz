const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: "everyone"
});

require("dotenv").config();
let config = require("./config.js");

const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const api = config.yt_api;
const youtube = new YouTube(api);
const music = new Map();
const Util = require("discord.js")
const fs = require("fs");

client.embed = Discord.MessageEmbed;

client.youtube = youtube
client.Util = Util

const { handleVideo, play } = require("./function.js")(Util, music, ytdl);

client.function = {
  handleVideo,
  play
}

client.function.handleVideo = handleVideo;
client.function.handle

client.login(config.token)

client.commands = new Discord.Collection();
client.modules = new Discord.Collection();
client.aliases = new Discord.Collection();

require("./src/module.js")(client, fs)

// events

client.on("ready", () => {
  console.log(`Login as ${client.user.username}`)
});

let prefix = config.prefix;

client.on("message", async message => {
  
  const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift();
  
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  client.url = url;
  
  
  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;
  
  command.run(message, client, args, config)
})

// events akhir