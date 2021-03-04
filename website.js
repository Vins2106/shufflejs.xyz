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
    res
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Listen to website!}`)
});