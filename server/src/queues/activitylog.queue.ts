import { Queue } from "bullmq";
import { redisConnection } from "../redis/client";

export const activityLogQueue = new Queue('activity-log', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        removeOnComplete: false,
        removeOnFail: false,
        backoff: {
            type: 'custom'
        }
    }
});

console.log('Activity log queue initialized');
