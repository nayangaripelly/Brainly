import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {UserModel, ContentModel} from "./db"
dotenv.config();

const app = express();
app.use(express.json());

const mongourl = process.env.MONGO_URL as string;


app.post("/api/v1/signup",async function(req, res)
{
    const {email , password} = req.body; // need to implement zod and password hashing..
    try {
        await UserModel.create({
            email,
            password
        })
    }catch(e)
    {
        res.status(403).json("user already exists");
        return;
    }
    res.status(200).json({
        msg:"you have successfully signed up"
    })
});

app.post("/api/v1/signin",async function(req,res)
{
    const {email,password} = req.body;
    const user = await UserModel.findOne({ // didn't handle the failed to fetch condition
        email,
        password
    })
    if(!user)
    {
        res.status(403).json({
            msg:"incorrect credentials or something went wrong"
        })
    }else
    {
        if (!process.env.USER_JWT_SECRET) {
            throw new Error("USER_JWT_SECRET is not defined");
        }
        const token = jwt.sign({ id:user._id},process.env.USER_JWT_SECRET);
        res.status(200).json({
            msg:"you are signed in",
            token
        })
    }
})

app.post("/api/v1/content",function(req, res)
{

})

app.get("/api/v1/content",function(req, res)
{

})

app.delete("/api/v1/content", function(req, res)
{

})

app.post("/api/v1/brain/share", function(req, res)
{

})

app.get("/api/v1/brain/:shareLink",function(req, res)
{

})

async function main()
{
    await mongoose.connect(mongourl);
    app.listen(3000);
}

main();