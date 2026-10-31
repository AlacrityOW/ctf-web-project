import express from 'express'
import multer from 'multer'
import fs from 'fs'

import { isAdmin, isUser } from '../middleware/auth.js'
import { getAllChallenge, getAChallenge, addChallenge,updateChallenge, deleteChallenge, checkAnswer, downloadChallenge, testFunction, undoDeleteChallenge } from '../controllers/challengeController.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const userDir = `uploads/${req.userId}`
        if(!fs.existsSync(userDir)){
            fs.mkdirSync(userDir, {recursive:true})
        }
        cb(null, userDir)
    },
    filename: (req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const minst = (multer.default || multer);
const upload = minst({
    storage:storage,
    limits:{
        fileSize:10*1024*1024, //10 MB (adjust here)
        files:1
    }
})

// Dev API
router.get("/testing/dev/api",testFunction)
//USER PRIVILEGES
router.get("/", isUser,getAllChallenge)
router.get("/:id/download",isUser,downloadChallenge)
router.get("/:id",isUser,getAChallenge)
router.patch("/:id/check-ans",isUser,checkAnswer)

//ADMIN PRIVILEGES
router.post("/create",isUser,isAdmin,upload.single('file'),addChallenge)
router.patch("/edit-challenge/:id",isUser,isAdmin,upload.single('file'),updateChallenge)
router.patch("/remove-challenge/:id",isUser,isAdmin,deleteChallenge)
router.patch("/restore-challenge/:id",isUser,isAdmin,undoDeleteChallenge)


export default router