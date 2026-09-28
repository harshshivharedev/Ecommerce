import { Request, Response} from "express";
import prisma  from "../lib/prisma.js"
import {hashSync} from 'bcrypt';

 const signup = async (req:Request, res: Response) =>{
    
    // destructure fields
    const {email, name, password} = req.body;

    // check user already 
    let user = await prisma.user.findFirst({
        where: {
           email
    }})

    if(user) {
        throw Error('User already exists');
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

export {signup}