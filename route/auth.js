const express= require('express')
const router = express.Router()
const {
  register,
  login,
  reset_password,
  verifyToken
} = require('../controllers/auth')

router.post('/signup' , register)
router.post('/login' , login)
router.post('/reset_password' , reset_password)
router.get('/verify_token' , verifyToken)

module.exports = router