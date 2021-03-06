/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jianjin.wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 14:35:39 by jianjin.wu        #+#    #+#             */
/*   Updated: 2017/05/22 17:49:07 by jianjin.wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

require('./globals')
require('./setup-qcloud-sdk')

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('getconfig') //TODO: 
const routes = require('./routes/index')
const Logger = require('./utils/logger').Logger('access')
const log4js = require('./utils/logger').log4js

const app = express()

// TODO: 
const fundebug = require('fundebug-nodejs')
fundebug.apikey = '39609f21a72aaa89f25bdd7db2fbe28ad4eabd88242d1be9d62d499f6242ee34'

global.Promise = require('bluebird')

fundebug.notify('Test', 'Hello Fundebug!')
// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(log4js.connectLogger(Logger, {
  level: 'INFO',            
  format: ':remote-addr  :method  :url  :status  :response-time' + 'ms'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// res middleware
app.use(require('./middlewares/res'))

app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  Logger.error(req.method, req.originalUrl, '404')
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

//由于只有四个参数时被当做error handler 所以此处必须有四个参数。由于为终止代码，所以next未被使用
// 统一的异常处理
/* eslint-disable no-unused-vars */
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
  //only be used in development
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