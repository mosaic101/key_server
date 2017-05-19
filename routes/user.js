
const router = require('express').Router()
const Joi = require('joi')
const joiValidator = require('../utils/joiValidator')
const userService = require('../services/userService')

router.post('/login', joiValidator({
  body: {
    //验证手机号1开头后十位为数字，必须
    phone: Joi.string().regex(/^1[0-9]{10}$/).required(),
    //验证验证码为6位数字，必须
    validateCode: Joi.string().regex(/^[0-9]{6}$/).required()
  }
}), (req, res) => {
  let phone = req.body.phone
  let validateCode = req.body.validateCode
  userService.login(phone, validateCode).then((token) => {
    res.success({
      token: token
    })
  }).catch((e) => {
    res.error(e)
  })
})


module.exports = router