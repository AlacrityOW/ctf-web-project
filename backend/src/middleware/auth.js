import jwt from 'jsonwebtoken'

//Authenticate REAL user
export async function isUser(req,res,next){
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]
    
    if(!token){
        console.log("Token",token)
        res.status(401).json({msg:"No Access Token, Log In First!"})
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

export async function isAdmin(req,res,next){
    
}