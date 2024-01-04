import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import propertiesRouter from './routes/propertiesRoutes.js';

import db from './config/db.js'


//create and configure the app
const app = express()
//port
const port = process.env.PORT || 3000;
//aply port and check
app.listen(port, () => {
    console.log(`server runs, port ${port}`)
})
//set pug as view engine and say where the views are
app.set('view engine', 'pug')
app.set('views', "./views")

//connect to the database
try {
    await db.authenticate()
    db.sync()
    console.log("All ok")
} catch (error) {
    console.log("Error: " + error)
}

//activate cookie parser
app.use( cookieParser() )

//activate csrf
//app.use(csrf({ cookie: true }))

app.use(express.urlencoded({ extended: true }));

//accept form data
app.use( express.urlencoded({extended:true}))

//public folder
app.use(express.static('public'))

//routing
app.use(`/auth`, authRouter)
app.use(`/properties`, propertiesRouter)
