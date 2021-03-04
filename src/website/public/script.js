async function test() { 
  fetch(`https://shufflejs.xyz/api`).then(async data => {
  let dataJson = await data.json();
  
  document.getElementById("channels").innerHTML = dataJson.channels;
  document.getElementById("users").innerHTML = dataJson.users;
  document.getElementById("servers").innerHTML = dataJson.guilds;
})
}

setInterval(function() {
  test()
}, 1000)