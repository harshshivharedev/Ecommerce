import { Request, Response } from "express";
import { AddressSchema, updateUserSchema } from "../schema/user.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";
import prisma from "../lib/prisma.js";
import { notFoundException } from "../exceptions/notFound.js";

//  fetch the user attached to the request by the auth middleware
const getAuthenticatedUser = (req: Request) => {
    const user = req.user;
    if (!user) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
    return user;
}

export const addAddress = async (req: Request, res: Response) => {
    const data = AddressSchema.parse(req.body);
    const user = getAuthenticatedUser(req);

    const address = await prisma.address.create({
        data: {
            ...data,
            userId: user.id
        }
    })
    res.json(address)
}

export const deleteAddress = async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        throw new notFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND);
    }

    //  only the owner of an address is allowed to delete it
    const address = await prisma.address.findFirst({
        where: {
            id,
            userId: user.id
        }
    })

    if (!address) {
        throw new notFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND);
    }

    await prisma.$transaction(async (transaction) => {
        await transaction.user.update({
            where: { id: user.id },
            data: {
                ...(user.defaultShippingAddress === address.id ? { defaultShippingAddress: null } : {}),
                ...(user.defaultBillingAddress === address.id ? { defaultBillingAddress: null } : {})
            }
        })

        await transaction.address.delete({
            where: { id: address.id }
        })
    })

    res.json(address)
}

export const listAddress = async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);

    const addresses = await prisma.address.findMany({
        where: {
            userId: user.id
        }
    })
    res.json(addresses)
}

//  set the default shipping / billing address (and optionally the name) of the logged in user
export const updateAddress = async (req: Request, res: Response) => {
    const user = getAuthenticatedUser(req);
    const validateData = updateUserSchema.parse(req.body);

    const data: {
        name?: string | null;
        defaultShippingAddress?: number | null;
        defaultBillingAddress?: number | null;
    } = {};

    //  findFirst returns null when there is no match, it does not throw
    if (validateData.defaultShippingAddress !== undefined && validateData.defaultShippingAddress !== null) {
        const shippingAddress = await prisma.address.findFirst({
            where: {
                id: validateData.defaultShippingAddress,
                userId: user.id
            }
        })

        if (!shippingAddress) {
            throw new notFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
        }

        data.defaultShippingAddress = shippingAddress.id
    } else if (validateData.defaultShippingAddress === null) {
        data.defaultShippingAddress = null
    }

    if (validateData.defaultBillingAddress !== undefined && validateData.defaultBillingAddress !== null) {
        const billingAddress = await prisma.address.findFirst({
            where: {
                id: validateData.defaultBillingAddress,
                userId: user.id
            }
        })

        if (!billingAddress) {
            throw new notFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
        }

        data.defaultBillingAddress = billingAddress.id
    } else if (validateData.defaultBillingAddress === null) {
        data.defaultBillingAddress = null
    }

    if (validateData.name !== undefined) {
        data.name = validateData.name
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            defaultShippingAddress: true,
            defaultBillingAddress: true
        }
    })

    res.json(updatedUser)
}