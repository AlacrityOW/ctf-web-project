import fs from 'fs'
import Challenge from "../models/Challenge.js"
import User from '../models/User.js';
import path from 'path'
import { fileURLToPath } from 'url';
import { access, constants } from 'node:fs/promises';

export async function getAllChallenge(req,res){
    try {
        const challenge = await Challenge.find();
        // console.log("Get All Chall :")
        res.status(200).json(challenge)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Error !!"
        })
    }
    
}
export async function addChallenge(req,res){
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded.' });
    }
    // console.log(req.body.data)
    const {title, category, difficulty, points, flag} = JSON.parse(req.body.data)
    const fileUrlForDatabase = `/${req.file.path.replace(/\\/g, '/')}`;
    // console.log(fileUrlForDatabase)
    try {
        const challenge = new Challenge({title:title, category:category, difficulty:difficulty, points:points, fileurl : fileUrlForDatabase, flag})
        await challenge.save()
        console.log("New Challenge Added")
        res.status(201).json({
            success:true
        })
    } catch (error) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete stray file during cleanup:', err);
                else console.log('Successfully cleaned up stray file after database failure.');
            });
        }
        if (error.name === 'ValidationError') {
            console.error('Mongoose Validation Details:', error.errors);
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        // console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Error !!"
        })
    }
}
export async function updateChallenge(req,res){
    res.send("")
}
export async function deleteChallenge(req,res){
    res.send("")
}
export async function getAChallenge(req,res){
    const {id} = req.params
    try {
        const chall = await Challenge.findById(id)
        // console.log(chall)
        res.status(200).send(chall)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Error !!"
        })
    }
}

export async function checkAnswer(req,res){
    // console.log(req.body)
    try {
        const {id} = req.params
        const user = await User.findById(req.userId)
        const chall = await Challenge.findById(id)
        const completed = user.completedList.some(cid => cid.toString() === id)
        if(completed){
            return res.status(400).json({msg:"Already Completed >:("})
        }
        // console.log(chall.flag, answer)
        const {answer} = req.body
        if(chall.flag == answer){
            // console.log(user)
            user.totalPoints = user.totalPoints + chall.points
            user.totalSolved += 1
            user.completedList.push(id)
            await user.save()
            res.status(200).json({msg:"Correct Answer HERE"})
        }else{
            res.status(422).json({msg:"Wrong Answer Too BAD"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Error !!"
        })
    }
}

export async function downloadChallenge(req,res){
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    // console.log(__dirname)
    try {
        const {id} = req.params
        const filedata = await Challenge.findById(id)
        if(!filedata){
            return res.status(404).json({msg:"Challenge Doesn't Exist!"})
        }

        const filepath = path.join(__dirname,'../..',filedata.fileurl)
        console.log(filepath)
        try {
            const test = await access(filepath, constants.F_OK)
            console.log(test)
        } catch (fserror) {
            console.log(fserror)
            return res.status(404).json({msg:"File path INVALID"})
        }
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.download(filepath, filedata.title, (dlerr)=>{
            if(dlerr){
                console.log("Download Err: ",dlerr)
                if (!res.headersSent) {
                    res.status(500).json({ message: "Error downloading the file." });
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Error !!"
        })
    }
}