import express from "express";
import { addProduct, deleteProduct, listProduct, productDetail, updateProduct } from "../controllers/products";
import { userById } from "../controllers/users";
import { isAdmin, isAuth, requiredSignin } from "../middlewares/checkAuth";
const routerProduct  = express.Router();


routerProduct.get('/products', listProduct);
routerProduct.get('/products/:id', productDetail );
// routerProduct.post('/products/:userId',requiredSignin, isAuth, isAdmin, addProduct);
routerProduct.delete("/products/:id", deleteProduct);
routerProduct.put('/products/:id', updateProduct );

routerProduct.param("userId", userById)
// module.exports = productRouter;
export default routerProduct;

