
import { Request, Response } from "express";
import { changeQuantitySchema, CreateCartSchema } from "../schema/cart.js";
import { notFoundException } from "../exceptions/notFound.js";
import { ErrorCode } from "../exceptions/root.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import prisma from "../lib/prisma.js";

export const addItemToCart = async (req: Request, res: Response) => {
    // the route is guarded by authMiddleware, but TS still sees req.user as optional
    const user = req.user;
    if (!user) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }

    const validatedData = CreateCartSchema.parse(req.body);
    let product
    try {
        product = await prisma.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })

    } catch ( err ) {
        throw new notFoundException('productt not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    const cart = await prisma.cartItems.create({
        data: {
            userId: user.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    })
    res.json(cart);
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    await prisma.cartItems.delete({
        where: {
            id: +req.params.id
        }
    })
    res.json({success: true})
}

export const changeQuantity = async ( req: Request, res: Response ) => {
    const valideatedData = changeQuantitySchema.parse(req.body);
    const updatedCart = await prisma.cartItems.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: valideatedData.quantity
        }
    })
    res.json(updatedCart)
}
 
export const getCart = async ( req: Request, res: Response) => {
    const cart = await prisma.cartItems.findMany({
        where: {
            userId: req.user?.id
        },
        include: {
            product: true
        }
    })
    res.json(cart);
}