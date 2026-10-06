import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    school:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        unique:true,
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    gender:{
        type:String,
        required:true
    },
    ageGroup:{
        type:String,
        required:true
    },
    region:{
        type:String,
        required:true
    },
    playerType:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User