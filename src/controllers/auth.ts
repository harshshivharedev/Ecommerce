import { NextFunction, Request, Response} from "express";
import "dotenv/config";
import prisma from "../lib/prisma.js"
import {hashSync, compareSync} from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestException } from "../exceptions/badRequest.js";
import { ErrorCode } from "../exceptions/root.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { SignupSchema, LoginSchema } from "../schema/user.js";
import { notFoundException } from "../exceptions/notFound.js";

//  never leak the password hash to the client
const userSelect = {
    id: true,
    email: true,
    name: true,
    role: true
} as const;

 const signup = async (req:Request, res: Response, next:NextFunction) =>{

    SignupSchema.parse(req.body);
        // destructure fields
        const {email, name, password} = req.body;

        // check user already 
        const existingUser = await prisma.user.findFirst({
            where: {
            email
        }})

        if(existingUser) {
            throw new BadRequestException("User already exists!", ErrorCode.USER_ALREADY_EXISTS);
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10)
            },
            select: userSelect
        })

        res.json(user);
    
    
}

const login = async ( req:Request, res:Response, next: NextFunction) => {

    const { email, password} = LoginSchema.parse(req.body);

    let user = await prisma.user.findFirst({where: {email}});

    if(!user) {
        throw new notFoundException('User not found', ErrorCode.USER_NOT_FOUND)
    }

    if(!compareSync(password, user.password)){
        throw new BadRequestException('Incorrect password!', ErrorCode.INCORRECT_PASSWORD);
    }

    const secret = process.env.JWT_SECRET;

    if(!secret){
        throw Error("token issue")
    }
    const token = jwt.sign({
        userId: user.id
    }, secret, { expiresIn: '7d' })

    res.json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        },
        token
    })
}

//  me -> return the logged in user
const me = async ( req:Request, res:Response, next: NextFunction) => {

    const user = req.user;

    if(!user) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }

    //  never expose the password hash
    const { password, ...safeUser } = user;

    res.json(safeUser)
}

export {
    signup,
    login,
    me
}