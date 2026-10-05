import { Request, Response } from "express";
import prismaClient from "../lib/prisma.js";
import { notFoundException } from "../exceptions/notFound.js";
import { ErrorCode } from "../exceptions/root.js";
import { ProductSchema, updateProductSchema } from "../schema/user.js";
import { BadRequestException } from "../exceptions/badRequest.js";

const parseTags = (tags: string) => tags ? tags.split(',') : [];

export const createProduct = async(req: Request, res: Response) => {

    // validate the incoming request
    const data = ProductSchema.parse(req.body);

    const product = await prismaClient.product.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            tags: data.tags.join(',')   // ['tea', 'india'] => "tea,india"
        }
    })
    res.json({ ...product, tags: parseTags(product.tags) })
}

export const updateProduct = async ( req:Request, res: Response) => {
    const data = updateProductSchema.parse(req.body);
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        throw new notFoundException('product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    const existingProduct = await prismaClient.product.findFirst({ where: { id } });

    if (!existingProduct) {
        throw new notFoundException('product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    //  pull tags out of the payload so it can be serialised as a comma separated string
    const { tags, ...rest } = data;

    const product = await prismaClient.product.update({
        where: {
            id
        },
        data: {
            ...rest,
            ...(tags ? { tags: tags.join(',') } : {})
        }
    })
    res.json({ ...product, tags: parseTags(product.tags) })
}

export const deleteProduct = async ( req:Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        throw new notFoundException('product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    const existingProduct = await prismaClient.product.findFirst({ where: { id } });

    if (!existingProduct) {
        throw new notFoundException('product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    const product = await prismaClient.product.delete({
        where: {
            id
        }
    })
    res.json({ ...product, tags: parseTags(product.tags) })
}

export const listProduct = async ( req:Request, res: Response) => {
    const rawSkip = req.query.skip;
    let skip = 0;

    if (rawSkip !== undefined) {
        if (typeof rawSkip !== 'string' || !/^\d+$/.test(rawSkip)) {
            throw new BadRequestException('skip must be a non-negative integer', ErrorCode.UNPROCESSABLE_ENTITY)
        }

        skip = Number(rawSkip);
        if (!Number.isSafeInteger(skip)) {
            throw new BadRequestException('skip must be a non-negative integer', ErrorCode.UNPROCESSABLE_ENTITY)
        }
    }

    const count = await prismaClient.product.count();
    const products = await prismaClient.product.findMany({
        skip,
        take: 5
    })
    res.json({
        count,
        data: products.map((product) => ({ ...product, tags: parseTags(product.tags) }))
    })
}

export const getProductById = async ( req:Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        throw new notFoundException('product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    const product = await prismaClient.product.findFirst({
        where: {
            id
        }
    })
    if (!product) {
        throw new notFoundException('product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    res.json({ ...product, tags: parseTags(product.tags) })
}