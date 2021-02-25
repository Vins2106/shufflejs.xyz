module.exports = async client => {
  client.on("ready", () => {
    console.log(`Login as ${client.user.username}`)
  })
}