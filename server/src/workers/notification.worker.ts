// src/workers/notification.worker.ts
import { Worker, type Job } from 'bullmq'
import { redisConnection } from '../redis/client'
import { sendNotification } from '../utils/send-notification'

const notificationWorker = new Worker('notification', async (job: Job) => {

    console.log('Job received:', job.name, job.data)

    if (job.name === 'ISSUE_ASSIGNED') {
        const { userId, message } = job.data
        console.log(`Sending assignment notification to user ${userId}: ${message}`)
        // your actual sendNotification call goes here
        await sendNotification({
            type: "ISSUE_ASSIGNED",
            user_id: userId,
            link: "some link",
            message: "get to work son",
            workspace_id: job.data.workspaceId
        });
    }


}, { connection: redisConnection })

notificationWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`)
});

notificationWorker.on('failed', (job, error) => {
    console.error(`Job ${job?.id} failed with error: ${error.message}`)
});

export default notificationWorker