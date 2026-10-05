
import { Request, Response } from "express";
import { CreateCartSchema } from "../schema/cart.js";
import { notFoundException } from "../exceptions/notFound.js";
import { ErrorCode } from "../exceptions/root.js";
import { Product } from "../../generated/prisma/client.js";
import { PrismaClient } from "@prisma/client/extension";
import { success } from "zod";

export const addItemToCart = async (req: Request, res: Response) {
    const validatedData = CreateCartSchema.parse(req.body);
    let product : Product
    try {
        product = await PrismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })

    } catch ( err ) {
        throw new notFoundException('productt not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    const cart = await PrismaClient.cartItem.create({
        data: {
            userId: req.user?.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    })
    res.json(cart);
}

export const deleteItemFromCart = async (req: Request, res: Response) {
    await PrismaClient.cartItem.delete({
        where: {
            id: +req.params.id
        }
    })
    res.json({success: true})
}

export const changeQuantity = async ( req: Request, res: Response ) {

}
 
export const getCart = async ( req: Request, res: Response) {
    
}