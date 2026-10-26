import fs from 'fs'
import Challenge from "../models/Challenge.js"

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