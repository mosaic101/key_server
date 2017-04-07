
const router = require('express').Router()
const auth = require('../utils/authorization')

router.get('/', (req,res) => {
  res.json('helloworld')
})
router.use('/user', require('./user'))
// router.use('/*', auth.checkToken)


module.exports = router