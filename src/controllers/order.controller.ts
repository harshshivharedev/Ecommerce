import prisma from "../lib/prisma.js";
import { Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";
import { notFoundException } from "../exceptions/notFound.js";
import { OrderEventStatus } from "../../generated/prisma/client.js";

export const createOrder = async (req: Request, res: Response) => {
    // the route is guarded by authMiddleware, but TS still sees req.user as optional
    const user = req.user;
    if (!user) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }

    // to create a transaction
    // to list all the cart items and procceed if cart is not empty
    // calculate the total amount
    // fetch address of user
    // to define computed field for formatted address on address module
    // we will create a order and order productsorder products
    // create event 
    // to empty the cart 

    return await prisma.$transaction(async(tx) => {
        const cartItems = await tx.cartItems.findMany({
            where: {
                userId: user.id
            },
            include: {
                product: true
            }
        })
        if(cartItems.length == 0) {
            return res.json({message: "cart is empty"})
        }

        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        },0);

        const address = await tx.address.findFirst({
            where: {
                id: user.defaultShippingAddress ?? undefined
            }
        })
        const order = await tx.order.create({
            data: {
                userId: user.id,
                netAmount: price,
                address: address?.formatedAddress ?? "",
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })
        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        })
        await tx.cartItems.deleteMany({
            where: {
                userId: user.id
            }
        })
    })
    
}
export const listOrders = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: user.id
        },
        include: {
            products: true
        }
    })
    res.json(orders)
}

export const cancleOrder = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }

    const id = Number(req.params.id);

    // wrap it inside a transaction so the order is only cancelled if it
    // belongs to the logged in user
    try {
        const order = await prisma.$transaction(async (tx) => {
            // findFirstOrThrow ensures the order exists AND belongs to the user
            const existingOrder = await tx.order.findFirstOrThrow({
                where: {
                    id,
                    userId: user.id
                }
            })

            //  an order cannot be cancelled once it is out for delivery or delivered
            const orderEvent = await tx.orderEvent.create({
                data: {
                    orderId: existingOrder.id,
                    status: OrderEventStatus.CANCLLED
                }
            })

            return orderEvent
        })
        res.json(order)
    } catch (err) {
        throw new notFoundException('ORDER not found', ErrorCode.ORDER_NOT_FOUND)
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }

    const id = Number(req.params.id);

    try {
        const order = await prisma.order.findFirstOrThrow({
            where: {
                id,
                userId: user.id
            },
            include: {
                products: true,
                event: true
            }
        })
        res.json(order)
    } catch (err) {
        throw new notFoundException('ORDER not found', ErrorCode.ORDER_NOT_FOUND)
    }
}