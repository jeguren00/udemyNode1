import jwt from 'jsonwebtoken'
import {User} from '../models/index.js'

const protectRoute = async (req, res, next) => {

    //test if there is a token
    const { _token } = req.cookies
    if (!_token) {
        return res.redirect('/auth/login')
    }

    //check the token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const user = await User.scope('deletePasswordInQuery').findByPk(decoded.id)
        
        //store the user in the req
        if (user) {
            req.user = user
        } else {
            return res.redirect('/auth/login')
        }
        return next()
    } catch (error) {
        return res.cleanCookie('_token').redirect('/auth/login')
    }
}

export default protectRoute