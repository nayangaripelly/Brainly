import mongoose from "mongoose";
const schema = mongoose.Schema;
const objectId = schema.Types.ObjectId;

const userSchema = new schema({
    email : {type: String, required: true, unique:true},
    password: {type: String, required: true}
})

const contentTypes = ["youtube", "tweet","doc","post" ];

const contentSchema = new schema({
    title : {type: String, required: true},
    type: {type:String, enum: contentTypes, required:true},
    link :{type: String,required: true},
    tags: [{type: objectId , ref: "tagSchema"}],
    userId: {type:objectId, ref:"userSchema",required: true}
})


const tagSchema =new schema({
    title:{type: String, required: true}
}) 

const linkSchema = new schema({
    hash: {type:String, unique:true, required: true},
    link : {type: String, required: true}
})

export const UserModel = mongoose.model("user",userSchema);
export const ContentModel = mongoose.model("content",contentSchema);
export const TagModel = mongoose.model("tag",tagSchema);
export const LinkModel = mongoose.model("link",linkSchema);

