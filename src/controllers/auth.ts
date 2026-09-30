import { NextFunction, Request, Response} from "express";
import "dotenv/config";
import prisma  from "../lib/prisma.js"
import {hashSync, compareSync} from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestException } from "../exceptions/badRequest.js";
import { ErrorCode } from "../exceptions/root.js";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { SignupSchema } from "../schema/user.js";
import { notFoundException } from "../exceptions/notFound.js";

 const signup = async (req:Request, res: Response, next:NextFunction) =>{

    SignupSchema.parse(req.body);
        // destructure fields
        const {email, name, password} = req.body;

        // check user already 
        let user = await prisma.user.findFirst({
            where: {
            email
        }})

        if(user) {
            throw new BadRequestException("User already exists!", ErrorCode.USER_ALREADY_EXISTS);
        }

        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10)
            }
        })

        res.json(user);
    
    
}

const login = async ( req:Request, res:Response, next: NextFunction) => {

    const { email, password} = req.body;

    let user = await prisma.user.findFirst({where: {email}});

    if(!user) {
        throw new notFoundException('User not found', ErrorCode.USER_NOT_FOUND)
    }

    if(!compareSync(password, user.password)){
        throw new notFoundException('Incorrect password!', ErrorCode.INCORRECT_PASSWORD);
    }

    const secret = process.env.JWT_SECRET;

    if(!secret){
        throw Error("token issue")
    }
    const token = jwt.sign({
        userId: user.id
    }, secret)

    res.json({
        user,
        token
    })
}

export {
    signup,
    login,
}