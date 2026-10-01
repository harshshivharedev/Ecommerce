
import { Router } from 'express'
import { errorHandler } from '../error.handler.js';
import { createProduct} from '../controllers/products.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const productsRoutes: Router = Router();

productsRoutes.post('/',[adminMiddleware,authMiddleware], errorHandler(createProduct));


export default productsRoutes