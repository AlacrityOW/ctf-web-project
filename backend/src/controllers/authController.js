// import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import Token from "../models/Token.js"
import bcrypt, {hash, compare} from 'bcryptjs'
import crypto from 'crypto'

const hashM = process.env.HASH_AMOUNT

//Personal Info
export async function getPersonalData(req,res){ //Use ID? + cookies or token
    const user = await User.findById(req.userId)
    // console.log(user)
    res.status(200).json(user)
}
export async function getAllUser(req,res){
    const user = await User.find({}).select("username school totalPoints")
    res.status(200).json(user)
}
export async function registAcc(req,res){
    console.log(req.body)
    const {
        school,
        username,
        password,
        email,
        gender,
        ageGroup,
        region,
        playerType
    } = req.body
    
    try {
        const salt = await bcrypt.genSalt(hashM)
        const hashed = await hash(password,salt)
        const user = new User({
            school,
            username,
            password:hashed,
            email,
            gender,
            ageGroup,
            region,
            playerType
        })
        await user.save()
        console.log("New user added")
        res.status(201).json({
            success:true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Error !!"
        })
    }
}
export async function loginVerif(req,res){
    const {password, email} = req.body
    //Check @ to tell from username or email
    //Maybe find alternative later for Verification, otherwise username must be Unique
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success : false
            });
        }
        const verPass = await compare(password,user.password)
        if(!verPass){
            return res.json({
                success : false
            })
        }
        //Creating Tokens
        const tokenMatch = crypto.randomUUID()

        const accessToken = jwt.sign({
            sub:user._id
        },process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'})

        const refreshToken = jwt.sign({
            sub:user._id,
            jti:tokenMatch
        },process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})

        await Token.create({userId:user._id, jti:tokenMatch})
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000
        })
        console.log("Logged in")
        res.json({
            success:true,
            accessToken,
        })
    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Error !!"
        })
    }
}

export async function refreshSesh(req, res){
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token missing" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        // console.log(err)
        if (err) return res.status(403).json({ error: "Refresh token expired or modified" });

        const activeSession = await Token.findOne({ jti: decoded.jti, userId: decoded.sub });
        if (!activeSession) {
            // console.log(activeSession)
            return res.status(403).json({ error: "Session has been manually revoked" });
        }
        const newAccessToken = jwt.sign({ 
            sub: decoded.sub 
        },process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});

        return res.json({ accessToken: newAccessToken });
    });
}

export async function logoutSingle(req,res){
    const refreshToken = req.cookies.refreshToken
    if(refreshToken){
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await Token.deleteOne({ jti: decoded.jti });
        } catch (error) {
            res.status(500).json({
                success:false,
                message:"Token is not here"
            })
        }
        res.clearCookie('refreshToken',{ httpOnly: true, secure: true, sameSite: 'strict' })
        res.status(200).json({
            msg:"Logout from This device successfully"
        })
    }
}
export async function logoutAll(req,res){
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await Token.deleteMany({ userId: decoded.sub });
    
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });
        return res.json({ message: "Logged out of all devices successfully" });
    } catch (error) {
        return res.status(403).json({ error: "Invalid session" });
    }
}
//for search with Username
export async function findAccount(req,res){
    const {username} = req.body
    try {
        const userlist = await User.find({username:{$regex:username, $options:"i"}}).select("username")
        // console.log(userlist)
        res.status(200).json(userlist)
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Error !!"
        })
    }
}