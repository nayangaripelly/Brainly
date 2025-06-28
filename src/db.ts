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
    // tags: [{type: objectId , ref: "tags"}], // refs should relate to model names not schema names
    tags: [String],
    userId: {type:objectId, ref:"users",required: true}
})


const tagSchema =new schema({
    title:{type: String, required: true}
}) 

const linkSchema = new schema({
    hash: {type:String, unique:true, required: true},
    userId : {type: objectId, ref:"users" ,required: true, unique:true}
})

export const UserModel = mongoose.model("users",userSchema);
export const ContentModel = mongoose.model("contents",contentSchema);
export const TagModel = mongoose.model("tags",tagSchema);
export const LinkModel = mongoose.model("links",linkSchema);

