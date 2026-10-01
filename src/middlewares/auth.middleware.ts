import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import * as jwt from 'jsonwebtoken'
import "dotenv/config";
import  PrismaClient  from "../lib/prisma.js";


export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    // extract the token from header
    const token = req.headers.authorization;

    // if tokenis not present, throw an errorunathorised
    if(!token){
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }
    try {
        // if the token is present, verify that token and extract the payload
        const secret = process.env.JWT_SECRET;
        if(!secret) return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
        const payload = jwt.verify(token , secret) as any;

        // to get the user from the payload
        const user = await PrismaClient.user.findFirst({ where : {id: payload.userId}});
        if(!user) {
           return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
        }

        // to attach the user to the current request object
        req.user = user
        next();


    } catch (error) {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }
    
}