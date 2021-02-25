require("dotenv").config()

module.exports = async (Discord, client, config) => {
  client.login(config.token)
}