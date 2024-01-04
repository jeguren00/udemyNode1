import express from "express";
import {renderLoginView, renderRegView, forgotPasswordView, registerUser, confirm, restPasswordView, restPasswordTokenView, newPassword, authenticate} from '../controllers/loginController.js'


const router = express.Router()

router.get('/login', renderLoginView)
router.get('/register', renderRegView)
router.get('/forgotpassword', forgotPasswordView)
router.get('/confirm/:token', confirm)
router.get('/restPassword/:token', restPasswordTokenView)


router.post('/userRegister', registerUser)
router.post('/restPassword', restPasswordView)
router.post('/restPassword/:token', newPassword)
router.post('/login', authenticate)


export default router