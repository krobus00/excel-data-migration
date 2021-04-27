require('dotenv').config()
const express = require('express')
const app = express()
const response = require('express-rest-response')
const db = require('./models')
const options = {
  showStatusCode: true,
  showDefaultMessage: true,
}
app.use(express.json())
app.use(response(options))

app.use('/api', require('./routes/api.route'))

app.use((req, res, next) => {
  let error = new Error('')
  error.code = 404
  next(error)
})
app.use((err, req, res, next) => {
  if (err.code === 404) return res.rest.notFound()
  return res.rest.serverError(err.message || null)
})
const PORT = process.env.PORT || 3000
const dbOptions = {
  // alter: true,
  // force: true,
}
db.sequelize
  .sync(dbOptions)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on: http://localhost:${PORT}`)
    })
  })
  .catch((err) => console.log('Gagal koneksi ke database', err))
