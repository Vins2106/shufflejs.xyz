const express = require('express')
const app = express()
const { client, Discord, youtube } = require("./bot.js");
const axios = require("axios");
const bodyParser = require("body-parser")
const urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(express.static("src/website/public"));
app.set('views', './src/website/views')  

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    req,
    res,
    client
  })
})

app.get("/invite", async (req, res) => {
  res.redirect("https://discord.com/oauth2/authorize?client_id=814371759264235560&scope=bot&permissions=2146827775")
});

app.get("/support", async (req, res) => {
  res.redirect("https://urlcord.cf/shuffle")
});

app.get("/api", (req, res) => {
  let users = 0;
  client.guilds.cache.map(x => {
    users = users + x.memberCount;
  })
  
  res.send({
    users: users,
    channels: client.channels.cache.size,
    guilds: client.guilds.cache.size
  })
});
 
app.listen(process.env.PORT, () => {
  console.log(`Listen to website!`)
});