import { Queue } from "bullmq";
import { redisConnection } from "../redis/client";

export const generalQueue = new Queue('general', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'custom',
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});