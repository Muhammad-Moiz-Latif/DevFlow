import { Queue } from "bullmq";
import { redisConnection } from "../redis/client";

export const notificationQueue = new Queue('notification', {
    connection: redisConnection,
    defaultJobOptions: {
        // will retry the job a set no of times
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        },
        // jobs will be removed or saved based on whether they get completed or not
        removeOnComplete: true,
        removeOnFail: false
    },
});

console.log('Notification queue initialized')
