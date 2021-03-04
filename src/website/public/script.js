let axios = require('axios');

fetch(`https://magnificent-available-justice.glitch.me/api`).then(data => {
  document.getElementById("channels").innerHTML = data.data.channels
})