const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('getconfig')
const routes = require('./routes/index')
const Logger = require('./utils/logger').Logger('access')
const log4js = require('./utils/logger').log4js
const app = express()
const middlewares = require('./middlewares')


//将node原生Promise替换成bluebird
global.Promise = require('bluebird')

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(log4js.connectLogger(Logger, {
  level: 'INFO',
  //       访问IP           请求方式        路由      处理状态        响应花费时间
  format: ':remote-addr  :method  :url  :status  :response-time' + 'ms'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

// 增加自定义的中间件
app.use(middlewares.res)

app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  Logger.error(req.method, req.originalUrl, '404')
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

//由于只有四个参数时被当做error handler 所以此处必须有四个参数。由于为终止代码，所以next未被使用
/* eslint-disable no-unused-vars */
// 统一的异常处理
app.use((err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  if (err) {
    Logger.error({
      method: req.method,
      url: req.originalUrl,
      message: err.message,
      stack: err.stack
    })
  }
  if (!err.status) {
    err.status = 500
  }
  res.status = err.status || 500
  //仅限开发时使用
  if (app.get('env') === 'development') {
    res.json({
      tag: 'error',
      status: err.status,
      message: err.message,
      stack: err.stack
    })
  } else {
    res.json({
      tag: 'error',
      status: err.status,
      message: err.message
    })
  }
})


module.exports = app