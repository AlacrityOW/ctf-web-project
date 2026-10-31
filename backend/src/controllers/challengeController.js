import Challenge from "../models/Challenge.js"
import User from '../models/User.js';
import path from 'path'
// import { fileURLToPath } from 'url';
import fs, { access, constants } from 'node:fs/promises';
import AuditLog from '../models/AuditLog.js';


export async function testFunction(req,res){
    const ip = await AuditLog.find()
    .populate('userId','username email isAdmin')
    .populate('challengeId','title fileurl')
    .sort({createdAt:-1})
    console.log(ip)
    res.status(200).json({test:ip})
}
//DONE | CHANGED FROM LOOK ALL UP, TO DEDICATED PAGINATION
export async function getAllChallenge(req,res){
    try {
        const page = parseInt(req.query.page) || 1
        const limit  = parseInt(req.query.viewSize) || 10
        // console.log(req.query)

        const safeLimit = Math.min(limit,20)
        let filter = {
            isDeleted:{$ne:true}
        }
        const skip = (page - 1)* safeLimit
        const userType = await User.findOne({_id:req.userId},{isAdmin:1})
        if(userType.isAdmin){
            filter = {}
        }
        const challenge = await Challenge.find(filter)
            .select('title category difficulty points isDeleted')
            .skip(skip)
            .limit(safeLimit)
            .sort({createdAt:-1})
        
        const total = await Challenge.countDocuments(filter)
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

//DONE | NO MIMETYPE FILTER YET
export async function addChallenge(req,res){
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded.' });
    }
    if(!JSON.parse(req.body.data)) return res.status(400).json({msg:'Empty'})
    // console.log(req.body.data)
    const {title, category, difficulty, points, flag} = JSON.parse(req.body.data)
    const fileUrlForDatabase = `/${req.file.path.replace(/\\/g, '/')}`;
    // console.log(fileUrlForDatabase)
    try {
        const challenge = new Challenge({title, category, difficulty, points, fileurl : fileUrlForDatabase, flag})
        await challenge.save()
        console.log("New Challenge Added")
        const aulog = new AuditLog({
            userId:req.userId,
            challengeId:challenge._id,
            action:'Create',
            ip_address:req.ip,
        })
        await aulog.save()
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

// WIP || Can be improved
export async function updateChallenge(req,res){
    const resobj = {
        msg:'No changes were made',
        success:true
    }
    const {id} = req.params
    const update = {...JSON.parse(req.body.data)}
   
    if(!update && !req.file) return res.status(200).json(resobj)
    
    Object.keys(update).forEach((key)=>{
        if(update[key]=== null || update[key] === undefined || update[key]==='' || update[key] === 0){
            delete update[key]
        }
    })
    
    if(Object.keys(update).length !== 0){
        try {
            const result = await Challenge.updateOne({
                _id:id
            },{
                $set:update
            })
            
            if(result.modifiedCount > 0){
                resobj.msg = 'Challenge Updated!'
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success:false,
                msg:"Internal Error !!"
            })
        }

    }
    
    if(req.file){
        try{
            const chall = await Challenge.findById(id)
            console.log('Challenge FIND',chall)
            if(!chall) {
                
                if (req.file) await fs.unlink(req.file.path);
                return res.status(404).json({
                    success:false,
                    msg:"Challenge not found"
                })
            }
            const fileUrlForDatabase = `/${req.file.path.replace(/\\/g, '/')}`;
            
            const fpath = path.join(import.meta.dirname,'../..',chall.fileurl)
        
            await fs.access(fpath)
            await fs.unlink(fpath)
            console.log('Deleted the Old Challenge file')
            chall.fileurl = fileUrlForDatabase
            await chall.save()

            const aulog = new AuditLog({
                userId:req.userId,
                challengeId:id,
                action:'Update',
                ip_address:req.ip,
            })
            await aulog.save()

            resobj.msg += ', File is updated!'
        } catch (ferror) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Failed to delete stray file during cleanup:', err);
                    else console.log('Successfully cleaned up stray file after database failure.');
                });
            }
            console.log(ferror)
        }
    }
    return res.status(200).json(resobj)
}

// DONE
export async function deleteChallenge(req,res){
    const {id} = req.params
    try {
        const result = await Challenge.updateOne({
            _id:id,
            isDeleted:{$ne:true}
        },{
            $set:{
                isDeleted: true,
                deletedAt: new Date()
            }
        })
        if(result.modifiedCount === 0){
            console.log("Challenge alr deleted")
            return res.status(400).json({msg:"Challenge Already Deleted"})
        }
        // Soft Delete then CRON will delete after 30 days
        // create new Log then save
        console.log("Challenge Deleted*")
        const aulog = new AuditLog({
            userId:req.userId,
            challengeId:id,
            action:'Delete',
            ip_address:req.ip,
        })
        await aulog.save()
        res.status(200).json({msg:"Challenge is deleted"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            msg:"Internal Error !!"
        })
    }
}
export async function undoDeleteChallenge(req,res){
    const {id} = req.params
    // console.log('ID',id)
    try {
        const result = await Challenge.updateOne({
            _id:id, isDeleted:{$ne:false}
        },{
            $set:{
                isDeleted: false,
                deletedAt: new Date()
            }
        })
        if(result.modifiedCount === 0){
            console.log("Challenge alr restored")
            return res.status(400).json({msg:"Challenge Already Restored"})
        }
        console.log("Undo Challenge Deletion")
        const aulog = new AuditLog({
            userId:req.userId,
            challengeId:id,
            action:'Undo',
            ip_address:req.ip,
        })
        await aulog.save()
        res.status(200).json({msg:"Challenge is Restored"})
        
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
        const chall = await Challenge.findOne(
            {
                _id:id,
                isDeleted:{$ne:true}
            },{isDeleted:0,fileurl:0}
        )
        // console.log(chall)
        res.status(200).send({chall,success:true})
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
    // const __dirname = path.dirname(fileURLToPath(import.meta.url))
    // console.log('Old Dir name',__dirname)
    // console.log('new Dir name',import.meta.dirname)
    try {
        const {id} = req.params
        const filedata = await Challenge.findById(id)
        if(!filedata){
            return res.status(404).json({msg:"Challenge Doesn't Exist!"})
        }

        const filepath = path.join(import.meta.dirname,'../..',filedata.fileurl)
        // console.log(filepath)
        try {
            await access(filepath, constants.F_OK)
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