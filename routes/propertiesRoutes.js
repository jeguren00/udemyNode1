import express from "express";
import { admin, create } from "../controllers/propertiesController.js"

const router = express.Router()

router.get('/myProperties',admin)
router.get('/create',create)


export default router