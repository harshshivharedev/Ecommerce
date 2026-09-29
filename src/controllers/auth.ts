import { Request, Response} from "express";
import "dotenv/config";
import prisma  from "../lib/prisma.js"
import {hashSync, compareSync} from 'bcrypt';
import jwt from 'jsonwebtoken';

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

const login = async ( req:Request, res:Response) => {

    const { email, password} = req.body;

    let user = await prisma.user.findFirst({where: {email}});

    if(!user) {
        throw Error ('User does not exists!')
    }

    if(!compareSync(password, user.password)){
        throw Error('Incorrect password!');
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