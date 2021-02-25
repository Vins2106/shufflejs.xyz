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

const { handleVideo, play } = require("./function.js")(Util, music, ytdl);

client.login(config.token)

client.commands = new Discord.Collection();
client.modules = new Discord.Collection();
client.aliases = new Discord.Collection();

require("./src/module.js")(client, fs)

// events

client.on("ready", () => {
  console.log(`Login as ${client.user.username}`)
});



client.on("message", async message => {
  
})

// events akhir