fetch(`https://www.kiky.cf/api`).then(data => {
  console.log(data.json().list)
})