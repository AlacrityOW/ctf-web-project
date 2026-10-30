import redis from 'redis'

const redisClient = redis.createClient({
    url : process.env.REDIS_URL
})

redisClient.on('error',(err)=> console.log('Redis',err))

const connectRedis = async () =>{
    await redisClient.connect()
    console.log('Connected to Redis')
}

export default redisClient;