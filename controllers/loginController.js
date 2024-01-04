import User from "../models/userModel.js"
import { check, validationResult } from "express-validator"
import { generateID, generateJWT } from "../helpers/tokens.js"
import { emailRegister, forgotPassword } from "../helpers/emails.js"
import bcrypt from 'bcrypt'


const renderLoginView = (req, res) =>{
    res.render('./auth/loginView', {pagina:"Login"})
}

const authenticate = async (req, res) =>{
    await check('email').isEmail().withMessage('Not an email').run(req)
    await check('password').notEmpty().withMessage('Password required').run(req)

    let validationResultCheck = validationResult(req)
    if (!validationResultCheck.isEmpty()) {
        return res.render('./auth/loginView', {
            pagina:"Login",
            //csrfToken:req.csrfToken(),
            errores:validationResultCheck.array(), 
        }) 
    }

    //check if user exists and if he has confirmed his account
    const {email, password}  = req.body
    const user = await User.findOne({where: {email: email}})

    if(!user) {
        return res.render('./auth/loginView', {
            pagina:"Login",
            //csrfToken:req.csrfToken(),
            errores:[{msg: 'User does not exists'}], 
        }) 
    }

    if (!user.confirmed) {
        return res.render('./auth/loginView', {
            pagina:"Login",
            //csrfToken:req.csrfToken(),
            errores:[{msg: 'Account not confirmed'}], 
        }) 
    }

    if (!user.verifyPassword(password)) {
        return res.render('./auth/loginView', {
            pagina:"Login",
            //csrfToken:req.csrfToken(),
            errores:[{msg: 'Incorrect password'}], 
        }) 
    }

    const token = generateJWT({id:user.id, name:user.name})
    console.log(token)

    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true
    }).redirect('/myProperties')
}


const renderRegView = (req, res) =>{
    res.render('./auth/regView', {
        pagina:"Crear cuenta"
        //csrfToken: req.csrfToken()
    }) 
}

const forgotPasswordView = (req, res) =>{
    res.render('./auth/forgotPasswordView', {pagina:"Olvidé mi password"}) 

}

const restPasswordView = async (req, res) =>{
    await check('email').isEmail().withMessage('Not an email').run(req)

    let validationResultCheck = validationResult(req)
    if (!validationResultCheck.isEmpty()) {
        return res.render('./auth/forgotPasswordView', {
            pagina:"Olvidé mi password",
            //csrfToken:req.csrfToken(),
            errores:validationResultCheck.array(), 
        }) 
    }

    //Search user
    const {email}  = req.body
    const user = await User.findOne({where: {email: email}})

    if(!user) {
        return res.render('./auth/forgotPasswordView', {
            pagina:"Olvidé mi password",
            //csrfToken:req.csrfToken(),
            errores:[{msg: 'Email not found in our database'}], 
        }) 
    }

    user.token = generateID()
    await user.save()

    forgotPassword({
        name: user.name,
        email: user.email,
        token: user.token
    })

    res.render('templates/message', {pagina:"Restablish your password", message: 'We have send you an email to restablish acces to your account'}) 

}

const restPasswordTokenView = async (req, res) =>{
    const { token } = req.params
    const user = await User.findOne({where: {token}})

    if (!user) {
        return res.render('templates/message', {pagina:"Error while restablishing your password", message: 'We had an error restablishingthe password of your account. Try again', error: true}) 
    }

    return res.render('auth/resetPassword', {pagina:"Reestablish your password"}) 

}

const newPassword = async (req, res) =>{
    await check('password').isLength({min:6}).withMessage('Password at least 6 characters').run(req)

    let validationResultCheck = validationResult(req)
    if (!validationResultCheck.isEmpty()) {
        return res.render('./auth/resetPassword', {
            pagina:"Reestablish your password",
            //csrfToken:req.csrfToken(),
            errores:validationResultCheck.array()
        }) 
    }

    const { token } = req.params
    const { password } = req.body
    console.log(req.body)
    const user = await User.findOne({where: {token}})

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.token = null
    await user.save()

    return res.render('auth/confirmAccount', {pagina:"Reset completed", message: 'Your password has been changed', error: false}) 


}

const registerUser = async (req, res) =>{

    await check('name').notEmpty().withMessage('Name cannot be empty').run(req)
    await check('email').isEmail().withMessage('Not an email').run(req)
    await check('password').isLength({min:6}).withMessage('Password at least 6 characters').run(req)
    //await check('password').equals('repetirPassword').withMessage('Passwords not equal').run(req)

    console.log(validationResult(req))
    let validationResultCheck = validationResult(req)
    if (!validationResultCheck.isEmpty()) {
        return res.render('./auth/regView', {
            pagina:"Crear cuenta",
            //csrfToken:req.csrfToken(),
            errores:validationResultCheck.array(), 
            user:{
                name: req.body.name,
                email: req.body.email
            }
        }) 
    }
    //extrac data
    const {name, email, password } = req.body
    //verify if user exists
    const userExistsCheck = await User.findOne({where: {email: req.body.email}})
    if (userExistsCheck) {
        return res.render('./auth/regView', {
            pagina:"Crear cuenta",
            //csrfToken:req.csrfToken(),
            errores:[{msg:"User already exists"}], 
            user:{
                name: req.body.name,
                email: req.body.email
            }
        }) 
    }
    //save user to the database
    const user = await User.create({
        name,
        email,
        password,
        token: generateID()
    })

    //email of confirmation
    emailRegister({
        name: user.name,
        email: user.email,
        token: user.token
    })

    res.render('templates/message', {pagina:"Account created succesfully", message: 'We have send you an email to confirm your account'}) 

}

const confirm = async (req, res) =>{
    const { token } = req.params
    //test if token is valid
    const user = await User.findOne({where: {token}})
    //confirm account
    if (!user) {
        return res.render('auth/confirmAccount', {pagina:"Error while confirming your account", message: 'We had an error confirming your account. Try again', error: true}) 
    }
    user.token = null
    user.confirmed = true
    await user.save();

    return res.render('auth/confirmAccount', {pagina:"Confirmation completed", message: 'Your account is confirmed correctly', error: false}) 
}

export {
    renderLoginView,
    renderRegView,
    forgotPasswordView,
    registerUser,
    confirm,
    restPasswordView,
    restPasswordTokenView,
    newPassword,
    authenticate
}