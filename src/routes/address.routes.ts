
import { Router } from "express";
import { errorHandler } from "../error.handler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addAddress, deleteAddress, listAddress, updateAddress } from "../controllers/address.js";

const addressRoutes: Router = Router()

// addresses belong to the logged in user, so only authentication is required here
addressRoutes.post('/', [authMiddleware], errorHandler(addAddress));
addressRoutes.get('/', [authMiddleware], errorHandler(listAddress));
addressRoutes.delete('/:id', [authMiddleware], errorHandler(deleteAddress));
addressRoutes.put('/', [authMiddleware], errorHandler(updateAddress))

export default addressRoutes;
