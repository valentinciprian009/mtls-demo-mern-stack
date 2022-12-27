const express = require('express')
const config = require('./config/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

// Routes
app.use('/', require('./controllers/mainRoutes'))
app.use('/news', require('./controllers/newsRoutes'))

// Middleware
app.use(middleware.requestLogger)
app.use(middleware.authHandler)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app