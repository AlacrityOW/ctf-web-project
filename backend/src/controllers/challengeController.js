import mongoose from "mongoose"
import Challenge from "../models/Challenge.js"

export async function getAllChallenge(req,res){
    try {
        const challenge = await Challenge.find();
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
    const {title, category, difficulty, points, fileurl} = req.body
    try {
        const challenge = new Challenge({title, category, difficulty, points, fileurl})
        await challenge.save()
        console.log("New Challenge Added")
        res.status(201).json({
            success:true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Error !!"
        })
    } 
}
export async function updateChallenge(req,res){
    res.send("")
}
export async function getAChallenge(req,res){ //use Session TOken or Cookies + ID?
    const {id} = req.params
    const chall = await Challenge.findById({id})
    console.log("")
    // res.send(chall)
}