require('dotenv').config()

const app = require('./app')
const port = 3000
require('./database')
require('./redis/blocklist-access-token')
require('./redis/allowlist-refresh-token')

app.use((req, res, next) => {
  res.set({
    'Content-Type': 'application/json'
  })
  next()
})

const routes = require('./rotas')
const { InvalidArgumentError, NaoEncontrado, NaoAutorizado } = require('./src/erros')
const jwt = require('jsonwebtoken')
routes(app)

app.use((error, req, res, next) => {
  let status = 500
  const corpo = {
    mensagem: error.message
  }
  if (error instanceof InvalidArgumentError) {
    status = 400
  }
  if (error instanceof NaoEncontrado) {
    status = 404
  }
  if (error instanceof NaoAutorizado) {
    status = 401
  }
  if (error instanceof jwt.JsonWebTokenError) {
    status = 401
  }
  if (error instanceof jwt.TokenExpiredError) {
    status = 401
    corpo.expiradoEm = error.expiredAt
  }

  res.status(status).json(corpo)
})

app.listen(port, () => console.log('A API está funcionando!'))
