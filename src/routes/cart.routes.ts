
import { Router } from 'express';
import { errorHandler } from '../error.handler.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from '../controllers/cart.controller.js';

const cartRoutes: Router = Router()

cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart))
cartRoutes.get('/', [authMiddleware], errorHandler(getCart));
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart));
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity));

export default cartRoutes