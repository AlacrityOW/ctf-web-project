import cron from 'node-cron'
import Challenge from '../models/Challenge.js'
import fs from 'fs/promises'
import path from 'path'


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

cron.schedule('* 0 0 * * *', async () =>{
    console.log('CRON Running . . .')
    try {
        await periodicCleanup()
        console.log('CRON Done')
    } catch (error) {
        console.log(error)
    }
},{scheduled:true, timezone:'UTC'})