
import { User } from "../../generated/prisma/client.js"
import express from 'express'
declare module "express-serve-static-core"
 {
    export interface Request {
        user?: User
    }
}