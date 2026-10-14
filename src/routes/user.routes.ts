
import { Router } from "express";
import { errorHandler } from "../error.handler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateAddress } from "../controllers/user.controller.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const userRoutes: Router = Router()

// addresses belong to the logged in user, so only authentication is required here
userRoutes.post('/', [authMiddleware], errorHandler(addAddress));
userRoutes.get('/', [authMiddleware], errorHandler(listAddress));
userRoutes.delete('/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.put('/', [authMiddleware], errorHandler(updateAddress))
userRoutes.put('/:id/role', [authMiddleware, adminMiddleware], errorHandler(changeUserRole));
userRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers));
userRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById))
export default userRoutes;
