import express from 'express'
import { isAdmin, isUser } from '../middleware/auth.js'
import { getAllChallenge, getAChallenge, addChallenge,updateChallenge } from '../controllers/challengeController.js'

const router = express.Router()

router.get("/", isUser,getAllChallenge)
router.post("/create",isUser,isAdmin,addChallenge)
router.put("/edit-challenge",isUser,isAdmin,updateChallenge)
router.get("/:id",isUser,getAChallenge)

export default router