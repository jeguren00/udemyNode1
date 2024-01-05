import { validationResult } from "express-validator"
import {Price, Category, Property} from '../models/index.js'


const admin = (req,res) => {
    res.render('./properties/adminView', {
        pagina:"My properties",
        head: true
    })
}

const create = async (req,res) => {
    //consult model of prices and categories
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ])

    res.render('./properties/createView', {
        pagina:"Create Properties",
        head: true,
        categories,
        prices,
        data: {}
    })
}

const save = async (req,res) => {
    //result of validation
    let result = validationResult(req)
    if (!result.isEmpty()) {
        console.log(result.array())
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ])
    
        return res.render('./properties/createView', {
            pagina:"Create Properties",
            head: true,
            categories,
            prices,
            errores: result.array(),
            data: req.body
        })
        
    }

    //register

    const { title, description, category: categoryId, price: priceid, rooms, parkings, bathrooms, street, lat, lng  } = req.body
    const {id : userID} = req.body
    try {
        const sendedProp = await Property.create({
            title,
            description,
            rooms,
            parkings,
            bathrooms, 
            street,
            lat, 
            lng,
            priceid,
            userID,
            categoryId,
            imagen: ''
        })
    } catch (error) {
        console.log(error)

    }
}

export {
    admin,
    create,
    save
}