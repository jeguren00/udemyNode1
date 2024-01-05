import categories from "./categoriesSeeder.js";
//import Category from "../models/categoryModel.js";
//import Price from "../models/priceModel.js";
import {Category, Price, User} from '../models/index.js'
import prices from "./pricesSeeder.js"
import users from "./usersSeeder.js"

import db from "../config/db.js";

const importData = async () => {
    try {
        //test database acces
        await db.authenticate()

        //generate columns
        await db.sync()

        //insert the data

        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users)
        ])

        console.log('Data imported correctly')
        process.exit(0)

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

const deleteData = async () => {
    try {
        await Promise.all([
            //Category.destroy({where: {}, truncate: true}),
            //Price.destroy({where: {}, truncate: true})
            await db.sync({force: true})
        ])
        console.log('Data deleted correctly')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

if (process.argv[2] === "-i") {
    importData()
}

if (process.argv[2] === "-d") {
    deleteData()
}