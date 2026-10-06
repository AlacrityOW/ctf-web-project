import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true },
    jti:{ 
        type: String, 
        required: true, 
        unique: true },
    createdAt:{ 
        type: Date, 
        default: Date.now, 
        expires: 604800 // 7 days in seconds
    }
}, {timestamps:true})

const Token = mongoose.model("Token",tokenSchema)
export default Token