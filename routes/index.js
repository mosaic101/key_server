/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jianjin.wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 16:21:10 by jianjin.wu        #+#    #+#             */
/*   Updated: 2017/05/22 17:51:23 by jianjin.wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const router = require('express').Router()

const auth = require('../middlewares/auth')
const user = require('./user')

router.get('/', (req,res) => {
  res.success('this is a homepage!')
})


router.use('/user', user)
//TODO: 
// router.use('/*', auth.checkToken)


module.exports = router