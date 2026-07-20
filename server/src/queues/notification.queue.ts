import { Queue } from "bullmq";
import { redisConnection } from "../redis/client";

export const notificationQueue = new Queue('notification', {
    connection: redisConnection,
    defaultJobOptions: {
        // will retry the job a set no of times
        attempts: 3,
        backoff: {
            type: 'custom'
        },
        // jobs will be removed or saved based on whether they get completed or not
        removeOnComplete: false,
        removeOnFail: false
    },
});

console.log('Notification queue initialized')
