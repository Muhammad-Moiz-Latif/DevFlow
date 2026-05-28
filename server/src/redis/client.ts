// src/lib/redis.ts
import Redis from 'ioredis'
import { type ConnectionOptions } from 'bullmq'

export const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379,
})

redisClient.on('connect', () => {
    console.log('Redis connected')
})

redisClient.on('error', (err) => {
    console.error('Redis error:', err)
})

export const redisConnection: ConnectionOptions = {
    host: '127.0.0.1',
    port: 6379,
}