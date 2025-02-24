
import express from 'express';
import { addCategory, editCategory, listCategoeies, listCategoryDetail, removeCategory } from '../controllers/categories';


const routerCategory = express.Router();

routerCategory.get('/categories', listCategoeies);
routerCategory.post('/categories', addCategory);
routerCategory.put('/categories/:id', editCategory);
routerCategory.delete('/categories/:id', removeCategory);
routerCategory.get('/categories/:id', listCategoryDetail);
export default routerCategory;