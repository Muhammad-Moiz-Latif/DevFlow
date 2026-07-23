// src/workers/notification.worker.ts
import { Worker, type Job } from 'bullmq'
import { redisConnection } from '../redis/client'
import { sendNotification } from '../utils/send-notification'
import { NotificationType } from '../db/schema/notifications'

type notificationTypeEnum = typeof NotificationType.enumValues[number];

const notificationWorker = new Worker('notification', async (job: Job) => {

    // your actual sendNotification call goes here
    await sendNotification({
        type: job.name as notificationTypeEnum,
        user_id: job.data.user_id,
        link: job.data.link,
        message: job.data.message,
        workspace_id: job.data.workspace_id
    });

}, {
    connection: redisConnection, settings: {
        backoffStrategy: (attemptsMade, type, err, job) => {
            const base = 1000;   // your existing 1000ms
            const max = 30000;   // hard ceiling, don't let it grow forever
            const cap = Math.min(max, base * 2 ** attemptsMade);
            return Math.random() * cap; // Full Jitter
        },
    }
});

notificationWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`)
});

notificationWorker.on('failed', (job, error) => {
    console.error(`Job ${job?.id} failed with error: ${error.message}`)
});

export default notificationWorker