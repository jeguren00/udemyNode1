import Category from "../models/categoryModel.js";
import Price from "../models/priceModel.js";
import Property from "../models/propertyModel.js";
import User from "../models/userModel.js";

Property.belongsTo(Price, {foreignKey: "priceId"})
Property.belongsTo(User, {foreignKey: "userID"})
Property.belongsTo(Category, {foreignKey: "categoryId"})


export {
    Price,
    Category,
    Property,
    User
}