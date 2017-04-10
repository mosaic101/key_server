
var jwt = require('jwt-simple')

/**
 * 解密token
 * @param token
 * @param callback
 * @returns {*}
 */
var getUserInfo = (token, callback) => {
  try {
    var decoded = jwt.decode(token, 'DELIVERY_APP_LOGIN')
    if (!decoded) {
      return callback({ message: '解析token失败!', status: 401 })
    }
    if (decoded.exp <= Date.now()) {
      return callback({ message: '登陆已过期，请重新登陆!', status: 401 })
    }
  } catch (error) {
    return callback({ message: '验证失败，请重新登录!', status: 401 })
  }
  // var key = 'delivery:user:id:' + decoded.id
  // return cache.getValue(key).then(function (value) {
  //   if (decoded.singleValue != value) {
  //     return callback({ message: '您的账户已在其他设备登录!', status: 401 })
  //   }
  //   return callback(null, decoded)
  // }).catch(function (err) {
  //   return callback({ message: '登陆已过期，请重新登陆!', status: 401 })
  // })
}

/**
 * 验证token
 * @param req
 * @param res
 * @param next
 */
exports.checkToken = function (req, res, next) {
  var token = req.headers.authorization
  //解密token
  getUserInfo(token, (error, result) => {
    if (error) {
      var err = new Error(error.message)
      return res.error(err, error.status)
    }
    //解析后的结果 放入req中
    req.auth = result
    next()
  })
};
