require("dotenv").config()

const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const MongoStore = require('connect-mongo')
const router = require("./router/index")

mongoose.connect(process.env.DB, { dbName: "maku" })
  .then(x => console.log(`Connected to Mongo! Database name: ${x.connection.name}`))
  .catch(error => console.log(`Error connecting to mongo`, error))

const app = express()

app.use(cors())
// credentials: true,
//   origin: "http://localhost:5173"
app.use(session({
  secret: 'SECRET',
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
    ttl: 24 * 60 * 60 * 1000
  })
}))

app.use("/api", router)

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
})
