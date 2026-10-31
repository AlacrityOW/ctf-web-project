import cron from 'node-cron'
import Challenge from '../models/Challenge.js'
import fs from 'node:fs/promises'
import path from 'path'
import AuditLog from '../models/AuditLog.js'


const periodicCleanup = async() =>{
    console.log('Automated Data Cleanup . .')
    try {
        const cutOff = new Date()
        cutOff.setDate(cutOff.getDate() - 30)
        const deletedChall = await Challenge.find({
            isDeleted:true,
            deletedAt:{$lt:cutOff}
        },{
            fileurl:1
        })
        console.log(deletedChall)
        if(deletedChall.length === 0){
            console.log('No challenge to cleanup')
            return
        }
        for(const chall of deletedChall){
            if(chall.fileurl){
                const fpath = path.join(import.meta.dirname,'../..',chall.fileurl)
                console.log(fpath)
                try {
                    await fs.access(fpath)
                    await fs.unlink(fpath)
                    console.log('Deleted the Challenge File(s)')
                } catch (ferror) {
                    console.log(ferror)
                }
            }
        }
        await Challenge.deleteMany({
            isDeleted:true,
            deletedAt:{$lt:cutOff}
        })
        console.log('Cleaned the Challenge Record(s)')
    } catch (error) {
        console.log(error)
    }
}

const exportMonthlyLog = async() =>{
    const curr = new Date()
    if(curr.getDate()!==1) return;
    console.log('Monthly Log Export . .')
    try {
        const year = curr.getFullYear()
        const month = curr.getMonth()
    
        const sd = new Date(year, month-1,1)
        const ed = new Date(year, month,1)

        const logs = await AuditLog.find({
            createdAt:{
                $gte:sd,
                $lt:ed
            }
        }).lean()
        if(logs.length === 0) return console.log('Nothing to export . . .')

        const logPath = path.join(import.meta.dirname,'../..','logs')
        await fs.mkdir(logPath,{recursive:true})
        const fname = `audit-log-${year}-${month}.json`
        const logFiledir = path.join(logPath,fname)

        await fs.writeFile(logFiledir,JSON.stringify(logs, null, 2),'utf-8')
        console.log('Successfully Exported Monthly Log . .')
        
    } catch (error) {
        console.log(error)
    }
}

cron.schedule('* 0 0 * * *', async () =>{
    console.log('CRON Running . . .')
    try {
        await periodicCleanup()
        await exportMonthlyLog()
        console.log('CRON Done')
    } catch (error) {
        console.log(error)
    }
},{scheduled:true, timezone:'UTC'})