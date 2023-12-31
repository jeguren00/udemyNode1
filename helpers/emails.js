import nodemailer from 'nodemailer'

const emailRegister = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, name, token } = datos

    //send the mail
    await transport.sendMail({
        from: 'bienesraices@Mail.com',
        to: email,
        subject: 'Confirm your account',
        text: 'Confirm your account',
        html:`
            <p>Hi ${name} your account is ready, you only need to click on the next link to activate it</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Activate Account</a></p>

            <p>If you did not created this account ignore the message</p>`
    })
}

export {
    emailRegister
}