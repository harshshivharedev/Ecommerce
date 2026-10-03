
import { Router } from "express";
import { errorHandler } from "../error.handler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {addAddress, deleteAddress, listAddress } from "../controllers/address.js";

const addressRoutes: Router = Router()

addressRoutes.post('/address',[authMiddleware, adminMiddleware], errorHandler(addAddress));
addressRoutes.delete('address/:id', [authMiddleware, adminMiddleware], errorHandler(deleteAddress));
addressRoutes.get('/address', [authMiddleware, adminMiddleware], errorHandler(listAddress));

export default addressRoutes;