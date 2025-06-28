import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto"; // new lib used for hashing

import {UserModel, ContentModel, LinkModel} from "./db"
dotenv.config();

import { userAuth } from "./middleware";
import { Request } from "express";
const app = express();
app.use(express.json());


const mongourl = process.env.MONGO_URL as string;
const userjwt = process.env.USER_JWT_SECRET  as string;

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
        const token = jwt.sign({ id:user._id},userjwt);
        res.status(200).json({
            msg:"you are signed in",
            token
        })
    }
})

app.use(userAuth);

interface customReq extends Request {
    id?: string;
}

app.post("/api/v1/content",async function(req:customReq, res)
{
    const {title,link,type,tags} = req.body;
    console.log(req.id);
    try {
        console.log("hello");
        await ContentModel.create({
            title,
            link,
            type,
            tags,
            userId :req.id
        })
        
        res.status(200).json({
            msg:"Content added"
        })
    }catch(e)
    {
        console.log(e);
        res.status(403).json({
            msg:"invalid token. Login once again"
        })
    }
})

app.get("/api/v1/content",async function(req:customReq, res)
{
    try{
        const content = await ContentModel.find({
            userId : req.id
        }).populate("userId","email"); //  relationships..

        res.status(200).json({
            content
        })
    }catch(e)
    {
        res.status(403).json({
            msg:"login once again, request failed"
        })
    }
})

app.delete("/api/v1/content",async function(req:customReq, res)
{
    const contentId = req.body.contentId;
    try {
        await ContentModel.deleteOne({
            _id : contentId,
            userId: req.id
        })

        res.status(200).json({
            msg: "deleted successfully"
        })
    }catch(e)
    {
        res.status(403).json({
            msg: "you are not allowed to delete..."
        })
    }
})

app.post("/api/v1/brain/share", async function (req:customReq, res) { 

  const share = req.body.share;
  const id = req.id;

  if (!share || !id) {
    res.status(400).json({ msg: "Missing share flag or user ID" });
    return;
  }

  const hash = crypto.randomBytes(8).toString("hex");

  await LinkModel.findOneAndUpdate(
    { userId: id },
    { hash, userId: id },
    { upsert: true, new: true }
  );

  res.status(200).json({
    link: `/api/v1/brain/${hash}`
  });
});



app.get("/api/v1/brain/:shareLink",async function(req, res)
{
    const hash = req.params.shareLink;
    try {
        const user = await LinkModel.findOne({
            hash
        })

        if(!user)
        {
            res.status(404).json({
                msg:"hash is invalid"
            })
        }
        const id = user?.userId;

        const content = await ContentModel.find({
            userId: id
        })

        const shared = await UserModel.findOne({
            _id:id
        })

        res.status(200).json({
            email: shared?.email,
            content
        })
    }catch(e)
    {
        res.status(500).json({
            msg:"something went wrong"
        })
    }
})

async function main()
{
    await mongoose.connect(mongourl);
    app.listen(3000);
}

main();