const express = require('express')
const app = express()
const { client, Discord } = require("./bot.js");

app.use(express.static("src/website/public"));
app.set('views', './src/website/views')  

app.get('/', (req, res) => {
  res.render("index.ejs", {
    client,
    Discord,
    req,
    res,
    require
  })
})

app.get("/api", (req, res) => {
  res.send({
    users: client.users.cache.size,
    channels: client.channels.cache.size,
    guilds: client.guilds.cache.size
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Listen to website!}`)
});