
const router = require('express').Router()
const auth = require('../utils/authorization')

router.use('/user', require('./user'))
router.use('/*', auth.checkToken)


module.exports = router