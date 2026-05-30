// src/workers/notification.worker.ts
import { Worker, type Job } from 'bullmq'
import { redisConnection } from '../redis/client'
import { sendNotification } from '../utils/send-notification'
import { NotificationType } from '../db/schema/notifications'

type notificationTypeEnum = typeof NotificationType.enumValues[number];

const notificationWorker = new Worker('notification', async (job: Job) => {

    const { userId } = job.data

    // your actual sendNotification call goes here
    await sendNotification({
        type: job.name as notificationTypeEnum,
        user_id: userId,
        link: "some link",
        message: "get to work son",
        workspace_id: job.data.workspaceId
    });

}, { connection: redisConnection })

notificationWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`)
});

notificationWorker.on('failed', (job, error) => {
    console.error(`Job ${job?.id} failed with error: ${error.message}`)
});

export default notificationWorker