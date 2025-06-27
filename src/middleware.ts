import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"; 
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.USER_JWT_SECRET as string;

 export function userAuth(req:Request, res:Response, next:NextFunction ) 
{
    const token = req.headers.token as string;
    const user = jwt.verify(token,secret) as jwt.JwtPayload & { id: string };
    if(user.id)
    {
        next();
    }else
    {
        res.status(403).json({
            msg:"invalid token, no entry"
        })
    }
}