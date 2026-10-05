import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { InternalException } from "../exceptions/internal.exception.js";
import { ErrorCode } from "../exceptions/root.js";
// NOTE: must be a default import, a namespace import ("import * as jwt") resolves to
// an object without `verify`/`sign` under ESM, which fails at runtime.
import jwt from 'jsonwebtoken'
import "dotenv/config";
import prisma from "../lib/prisma.js";


export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    // extract the token from header
    const authHeader = req.headers.authorization;

    // if token is not present, throw an error unauthorised
    if(!authHeader){
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }

    // the client may send either "Bearer <token>" or just "<token>"
    const [scheme, token] = authHeader.split(' ');

    const jwtToken = scheme.toLowerCase() === 'bearer' ? token : authHeader;

    if(!jwtToken){
        return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }

    try {
        // if the token is present, verify that token and extract the payload
        const secret = process.env.JWT_SECRET;
        if(!secret) return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
        const payload = jwt.verify(jwtToken , secret) as any;

        // to get the user from the payload
        const user = await prisma.user.findFirst({ where : {id: payload.userId}});
        if(!user) {
           return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
        }

        // to attach the user to the current request object
        req.user = user
        next();


    } catch (error: any) {
        //  only auth failures are turned into a 401, anything else is a real bug
        //  and must not be silently swallowed here
        if (!(error instanceof jwt.JsonWebTokenError) && error?.name !== 'TokenExpiredError') {
            console.error('authMiddleware unexpected error:', error);
            return next(new InternalException('Something went wrong!', error, ErrorCode.INTERNAL_EXCEPTION));
        }

        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }
    
}