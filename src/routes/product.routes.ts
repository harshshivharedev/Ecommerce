
import { Router } from 'express'
import { errorHandler } from '../error.handler.js';
import { createProduct, deleteProduct, listProduct, updateProduct , getProductById} from '../controllers/products.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const productsRoutes: Router = Router();

productsRoutes.post('/',[authMiddleware, adminMiddleware], errorHandler(createProduct));
productsRoutes.put('/:id',[authMiddleware, adminMiddleware], errorHandler(updateProduct));
productsRoutes.delete('/:id',[authMiddleware, adminMiddleware], errorHandler(deleteProduct))
productsRoutes.get('/', errorHandler(listProduct))
productsRoutes.get('/:id', errorHandler(getProductById))

export default productsRoutes