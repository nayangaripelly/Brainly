import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express"; 
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.USER_JWT_SECRET as string;

interface customReq extends Request {
    id?: string;
}

export function userAuth(req:customReq, res:Response, next:NextFunction ) 
{
    console.log("reached middleware");
    const token = req.headers.token as string;
    const user = jwt.verify(token,secret) as jwt.JwtPayload & { id: string };
    if(user.id)
    {
        console.log("changed req object");
        req.id = user.id;
        next();
    }else
    {
        res.status(403).json({
            msg:"invalid token, no entry"
        })
    }
}