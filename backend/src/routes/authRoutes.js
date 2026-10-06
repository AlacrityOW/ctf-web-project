import express from 'express'
import { isUser } from '../middleware/auth.js'
import { findAccount, getPersonalData, loginVerif, logoutAll, logoutSingle, refreshSesh, registAcc } from '../controllers/authController.js'

const router = express.Router()

// =========PUBLIC API==============
router.post("/register",registAcc)
router.post("/refresh",refreshSesh)
router.post("/login",loginVerif)

//=============USER API================
router.get("/personal-data",isUser,getPersonalData)
router.post("/logout",isUser,logoutSingle)
router.post("/logout-all",isUser,logoutAll)
router.query("/search-username",isUser,findAccount)
router.put("/update",()=>{}) // Profile Update

export default router