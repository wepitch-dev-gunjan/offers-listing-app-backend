const app = require('express')()
const mongoose = require('mongoose')
require('dotenv').config()
const { readdirSync } = require('fs')
const bodyParser = require('body-parser')

const { MONGODB_URI, PORT } = process.env

app.use(bodyParser.json())
// database connection
mongoose.connect(MONGODB_URI).then(() => {
  console.log('database is connected')
}).catch(err => console.log(err))

app.get('/', async (req, res) => {
  res.send('Welcome to offers listing app')
})

//routes
readdirSync('./routes').map(r => app.use('/', require('./routes/' + r)))

app.listen(PORT, () => console.log('Server is running on port : ' + PORT))