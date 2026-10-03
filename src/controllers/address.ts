
import { Request, Response } from "express";
import { AddressSchema } from "../schema/user.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";
import  PrismaClient  from "../lib/prisma.js";
import { User } from "../../generated/prisma/client.js"

export const addAddress = async ( req: Request, res: Response) => {
    AddressSchema.parse(req.body);
    const user = req.user;
    if (!user) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
// phir aage user.id use karo

    const address = await PrismaClient.address.create({
        data: {
            ...req.body,
            userId: user.id
        }
    })
    res.json(address)
}

export const deleteAddress = async ( req: Request, res: Response) => {

}

export const listAddress = async(req:Request, res: Response) => {

}