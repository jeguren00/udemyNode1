import express from "express";
import { admin, create, save } from "../controllers/propertiesController.js"
import { body } from "express-validator";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router()

router.get('/myProperties', protectRoute, admin)
router.get('/create', protectRoute, create)

router.post('/create',
    body('title').notEmpty().withMessage("The title is empty"),
    body('description')
        .notEmpty().withMessage("The description is empty")
        .isLength({max:200}).withMessage("The description is too long"),
    body('category').isNumeric().withMessage("Chose a category"),
    body('price').isNumeric().withMessage("Chose the price"),
    body('rooms').isNumeric().withMessage("Chose the number of rooms"),
    body('parkings').isNumeric().withMessage("Chose the number of parking spaces"),
    body('bathrooms').isNumeric().withMessage("Chose the number of bathrooms"),
    body('lat').notEmpty().withMessage("Set the property location on the map"),

    save
)


export default router