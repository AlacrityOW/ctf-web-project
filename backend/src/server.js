import express from 'express'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser'

import challengeRoutes from './routes/challengeRoutes.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()
const app = express();
const PORT = process.env.PORT || 1770
connectDB()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
//CHeck if user is already logged in, move him to Dashboard, otherwise move to Login page
// Apply auth to all API here
//Logins (GET for profile info?; POST for login; PUT for name?; DELETE for account terminate)
app.use("/api/auth",authRoutes)
//ctf-challenges(GET for challenge all, search, and sorting; POST for new challenge by Admin; PUT to edit Challenge; DELETE to remove challenge)
app.use("/api/ctf-challenges",challengeRoutes)


app.listen(PORT, ()=>{
    console.log("Opened at :", PORT)
})