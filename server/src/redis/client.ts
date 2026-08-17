import Redis from 'ioredis'
import 'dotenv/config'
import { type ConnectionOptions } from 'bullmq'

const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = Number(process.env.REDIS_PORT) || 6379

const redisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
} as const

export const redisClient = redisUrl
    ? new Redis(redisUrl, redisOptions)
    : new Redis({ host: redisHost, port: redisPort, ...redisOptions })

redisClient.on('connect', () => {
    console.log('Redis connected')
})

redisClient.on('error', (err) => {
    console.error('Redis error:', err)
})

export const redisConnection: ConnectionOptions = redisUrl
    ? {
        host: new URL(redisUrl).hostname,
        port: Number(new URL(redisUrl).port),
        ...redisOptions,
    }
    : {
        host: redisHost,
        port: redisPort,
        ...redisOptions,
    }