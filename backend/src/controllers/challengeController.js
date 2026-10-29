import fs from 'fs'
import Challenge from "../models/Challenge.js"
import User from '../models/User.js';
import path from 'path'
import { fileURLToPath } from 'url';
import { access, constants } from 'node:fs/promises';


//DONE
export async function getAllChallenge(req,res){
    try {
        const page = parseInt(req.query.page) || 1
        const limit  = parseInt(req.query.viewSize) || 10
        console.log(req.query)

        const safeLimit = Math.min(limit,30)

        const skip = (page - 1)* safeLimit


        const challenge = await Challenge.find()
            .select('title category difficulty points')
            .skip(skip)
            .limit(safeLimit)
            .sort({createdAt:-1})
        
        const total = await Challenge.countDocuments()
        res.status(200).json({
            success:true,
            currentPage: page,
            viewSize:safeLimit,
            totalPages:Math.ceil(total/safeLimit),
            data:challenge
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            msg:"Internal Error !!"
        })
    }
    
}

//DONE
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
            msg:"Internal Error !!"
        })
    }
}

// WIP
export async function updateChallenge(req,res){
    const {id} = req.params
    try {
        const chall = await Challenge.findById(id)
        //log updated file and the old file for rollback
        // apply change after
        //and also the files at uploads/
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            msg:"Internal Error !!"
        })
    }
}

// WIP
export async function deleteChallenge(req,res){
    const {id} = req.params
    try {
        const chall = await Challenge.findById(id)
        //Log the user who deletes the file?
        // THen delete the data from database
        //and also the files at uploads/
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            msg:"Internal Error !!"
        })
    }
}

//DONE
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
            msg:"Internal Error !!"
        })
    }
}

// DONE
export async function checkAnswer(req,res){
    try {
        const {id} = req.params
        const {answer} = req.body

        const chall = await Challenge.findById(id)
        if(!chall){
            return res.status(404).json({msg:"Challenge Not Found!"})
        }
        if (chall.flag !== answer) {
            return res.status(422).json({ msg: "You got it wrong!" });
        }

        const result = await User.updateOne(
            { 
                _id: req.userId, 
                completedList: { $ne: id }
            },
            { 
                $inc: { 
                    totalPoints: chall.points,
                    totalSolved: 1 
                },
                $push: { completedList: id } // Atomically appends to the array
            }
        );
        if(result.modifiedCount === 0){
            return res.status(400).json({msg:"Already Completed >:("})
        }
        res.status(200).json({msg:"Completed The Challenge"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            msg:"Internal Error !!"
        })
    }
}


//WORKS
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
        // console.log(filepath)
        try {
            const test = await access(filepath, constants.F_OK)
            // console.log(test)
        } catch (fserror) {
            console.log(fserror)
            return res.status(404).json({msg:"File path INVALID"})
        }
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.download(filepath, filedata.title, (dlerr)=>{
            if(dlerr){
                console.log("Download Err: ",dlerr)
                if (!res.headersSent) {
                    res.status(500).json({ msg: "Error downloading the file." });
                }
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            msg:"Internal Error !!"
        })
    }
}