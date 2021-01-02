var express = require('express')
var cookieParser = require('cookie-parser')
var cors = require('cors')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var subscribeRouter = require('./routes/subscribe')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(cookieParser())

app.set('services/pricing', require('./services/pricing')())
app.set('services/client', require('./services/client')())

app.use('/', indexRouter)
app.use('/subscribe', subscribeRouter)

app.get('services/pricing').start(app)

module.exports = app
