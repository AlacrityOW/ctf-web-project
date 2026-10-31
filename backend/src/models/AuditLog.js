import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    userId:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true },
    challengeId:{ 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref:'Challenge', 
    },
    action:{
        type: String,
        enum:[
            'Create',
            'Update',
            'Delete',
            'Undo',
        ],
        required:true
    },
    ip_address:{
        type:String,
    }
}, {timestamps:true})

auditLogSchema.index({createdAt:1})

const AuditLog = mongoose.model("AuditLog",auditLogSchema)
export default AuditLog