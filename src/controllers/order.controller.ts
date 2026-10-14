import { PrismaClient } from "@prisma/client/extension";
import { Request, Response } from "express";

export const createOrder = async (req: Request, res: Response) => {
    // to create a transaction
    // to list all the cart items and procceed if cart is not empty
    // calculate the total amount
    // fetch address of user
    // to define computed field for formatted address on address module
    // we will create a order and order productsorder products
    // create event 
    // to empty the cart 

    return await PrismaClient.$transaction(async(tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user?.id
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
                id: req.user?.defaultShippingAddress
            }
        })
        const order = await tx.order.create({
            data: {
                userId: req.user?.id,
                netAmount: price,
                address: address.formatedAddress,
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
        await tx.cartItem.deleteMany({
            where: {
                userId: req.user?.id
            }
        })
    })
    
}
export const listOrders = async (req: Request, res: Response) => {

}

export const cancleOrder = async (req: Request, res: Response) => {

}

export const getOrderById = async (req: Request, res: Response) => {

}