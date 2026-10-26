import express from 'express'
import multer from 'multer'
import fs from 'fs'

import { isAdmin, isUser } from '../middleware/auth.js'
import { getAllChallenge, getAChallenge, addChallenge,updateChallenge, deleteChallenge } from '../controllers/challengeController.js'

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

router.get("/", isUser,getAllChallenge)
router.post("/create",isUser,isAdmin,upload.single('file'),addChallenge)
router.put("/edit-challenge",isUser,isAdmin,updateChallenge)
router.delete("/remove-challenge/:id",isUser,isAdmin,deleteChallenge)
router.get("/:id",isUser,getAChallenge)

export default router