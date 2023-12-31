import User from "../models/userModel.js"
import { check, validationResult } from "express-validator"
import { generateID } from "../helpers/tokens.js"
import { emailRegister } from "../helpers/emails.js"

const renderLoginView = (req, res) =>{
    res.render('./auth/loginView', {pagina:"Login"})
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
    confirm
}