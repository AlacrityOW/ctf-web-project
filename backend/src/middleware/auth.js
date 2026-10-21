import jwt from 'jsonwebtoken'
import User from '../models/User.js'

//Authenticate REAL user
export async function isUser(req,res,next){
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]
    console.log("Token",token)
    if(!token){
        console.log("Token",token)
        return res.status(401).json({msg:"No Access Token, Log In First!"})
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
        if(err){
            console.log("JWT VERIFY",err)
            return res.status(401).json({msg:"Invalid Token"})
        }else{
            req.userId = decoded.sub
            next();
        }
        
    })
}

//Check if current user is Admin
export async function isAdmin(req,res,next){
    // console.log(req.cookies)
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]
    // console.log(token)
    if(!token){
        console.log("Token",token)
        return res.status(401).json({msg:"No Access Token, Log In First!"})
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err,decoded)=>{
        if(err){
            console.log("JWT VERIFY",err)
            return res.status(401).json({msg:"Invalid Token"})
        }

        try {

            //add Redis here later to save resources. ONLY check at DB after redis check return NULL, if fail then return
            const user = await User.findById(decoded.sub).select('isAdmin')
            if(!user || !user.isAdmin){
                // console.log("Non admin")
                return res.status(403).json({msg:"Access Denied"})
            }
            req.userId = decoded.sub
            next()
        }catch (error) {
            console.log("IS ADMIN Err", error)
            return res.status(500).json({msg:"Internal Error"})
        }
    })
}