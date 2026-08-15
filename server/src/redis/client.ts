// src/lib/redis.ts
import Redis from 'ioredis'
import 'dotenv/config'
import { type ConnectionOptions } from 'bullmq'

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = Number(process.env.REDIS_PORT) || 6379

export const redisClient = new Redis({
    host: redisHost,
    port: redisPort,
})

redisClient.on('connect', () => {
    console.log('Redis connected')
})

redisClient.on('error', (err) => {
    console.error('Redis error:', err)
})

export const redisConnection: ConnectionOptions = {
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
}