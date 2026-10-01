
import { Request, Response } from "express";
import  prismaClient  from "../lib/prisma.js";


export const createProduct = async(req: Request, res: Response) => {

    // create a validator to for this request

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')        // ['tea', 'india'] => "tea,india"
        }
    })
    res.json(product)   
}


