
import { Request, Response } from "express";
import { AddressSchema } from "../schema/user.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";
import  PrismaClient  from "../lib/prisma.js";
import { User } from "../../generated/prisma/client.js"
import { notFoundException } from "../exceptions/notFound.js";

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

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const address = await PrismaClient.address.delete({
            where: { id: +req.params.id }
        });
        res.json(address);
    } catch (err) {
        throw new notFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND);
    }
}


export const listAddress = async(req:Request, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
    const addresses = await PrismaClient.address.findMany({
        where: {
            userId: user.id
        }
    })
    res.json(addresses);
}