require("dotenv").config();

const data = {
  token: process.env.token,
  prefix: "s",
  owner: {
    id: ""
  },
  author: "",
  embed: ""
}

module.exports = {data};