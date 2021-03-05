const express = require('express')
const app = express()
const { client, Discord, youtube } = require("./bot.js");
const axios = require("axios");
const bodyParser = require("body-parser")
const urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(express.static("src/website/public"));
app.set('views', './src/website/views')  

app.get('/', (req, res) => {
  res.render("index.ejs", {
    client,
    Discord,
    req,
    res,
    axios
  })
})

app.post('/', urlencodedParser, async (req, res) => {
  
  let videos = await youtube.searchVideos(req.body.search, 10)
  
  res.render('search.ejs', {
    client,
    Discord,
    req,
    res,
    videos
  })
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
  console.log(`Listen to website!})
});