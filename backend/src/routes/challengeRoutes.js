import express from 'express'
import { getAllChallenge, getAChallenge, addChallenge,updateChallenge } from '../controllers/challengeController.js'

const router = express.Router()

router.get("/",getAllChallenge)
router.post("/create", addChallenge)
router.put("/edit-challenge",updateChallenge)
router.get("/:id",getAChallenge)

export default router