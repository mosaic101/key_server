/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jianjin.wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/19 14:39:23 by jianjin.wu        #+#    #+#             */
/*   Updated: 2017/05/19 14:57:32 by jianjin.wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')


const config = require('getconfig')['wisnucDB']

// const env = process.env.NODE_ENV || 'development'
// const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env]

let sequelize = new Sequelize(config.database, config.username, config.password, config)
let db = {}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function (file) {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
