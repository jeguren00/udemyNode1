import express from "express";
import {renderLoginView, renderRegView, forgotPasswordView, registerUser, confirm} from '../controllers/loginController.js'


const router = express.Router()

router.get('/login', renderLoginView)
router.get('/register', renderRegView)
router.get('/forgotpassword', forgotPasswordView)
router.get('/confirm/:token', confirm)


router.post('/userRegister', registerUser)

export default router