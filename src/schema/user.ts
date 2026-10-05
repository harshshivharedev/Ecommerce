import { z } from 'zod';

export const SignupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password:z.string().min(6)
})

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable().optional(),
    pincode: z.string().length(6),
    country: z.string(),
    city: z.string()
})

//  every field is optional here, so only the fields sent by the client get updated
export const updateUserSchema = z.object({
    name: z.string().nullable().optional(),
    defaultShippingAddress : z.number().int().positive().nullable().optional(),
    defaultBillingAddress: z.number().int().positive().nullable().optional()
})

//  create a validator to for this request
export const ProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.coerce.number().positive(),
    tags: z.array(z.string())
})

export const updateProductSchema = ProductSchema.partial()