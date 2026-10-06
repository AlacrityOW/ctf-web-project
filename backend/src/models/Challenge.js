import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    difficulty:{
        type:String,
        required:true
    },
    points:{
        type:Number,
        required:true
    },
    fileurl:{
        type:String,
        required:true
    }
}, {timestamps:true})

const Challenge = mongoose.model("Challenge",challengeSchema)
export default Challenge