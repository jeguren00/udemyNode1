import bcrypt from 'bcrypt'

const users = [
    {
        name: "jordi",
        email: "jordi@jordi.com",
        confirmed: 1,
        password: bcrypt.hashSync('123456', 10)
    }
]

export default users