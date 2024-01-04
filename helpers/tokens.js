import jwt from "jsonwebtoken"


const generateID = () => Math.random().toString().substring(2) + Date.now().toString(32) 
const generateJWT = data => jwt.sign({id:data.id, name:data.name}, process.env.JWT_SECRET, {expiresIn: '1d'})


export {
    generateID,
    generateJWT
}