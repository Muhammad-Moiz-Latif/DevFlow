import { Queue } from "bullmq";
import { redisConnection } from "../redis/client";

export const activityLogQueue = new Queue('activity-log', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    }
});

console.log('Activity log queue initialized');
