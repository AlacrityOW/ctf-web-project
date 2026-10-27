import express from 'express'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser'

import challengeRoutes from './routes/challengeRoutes.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()
const app = express();
const PORT = process.env.PORT || 1770  //DONT FORGET TO CHANGE AT FRONTEND .env if not using 1770
connectDB()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
//auth(Get profile data, refresh token, verification and registration, account search, Force Logouts)
//=========DONE==========DONE================DONE========================WIP============WIP=========
app.use("/api/auth",authRoutes)
//ctf-challenges(GET for challenge all, search, and specific challenge; POST for new challenge by Admin; PUT to edit Challenge; DELETE to remove challenge)
//=============================WIP(search)=============================================DONE=========================WIP=======================WIP=================
app.use("/api/ctf-challenges",challengeRoutes)

app.listen(PORT, ()=>{
    console.log("Opened at :", PORT)
})