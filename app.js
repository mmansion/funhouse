const express = require('express')
const app = express()
app.use('/', express.static('public'))
app.get('/favico.ico', (req, res) => {res.sendStatus(404);});
app.listen(80, () => { console.log(`app started`)})