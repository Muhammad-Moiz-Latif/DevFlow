import { Worker, type Job } from "bullmq";
import { authServices } from "../modules/auth/services";
import { redisConnection } from "../redis/client";

export const generalWorker = new Worker('general', async (job) => {
    const job_type = job.name;
    const userId = job.data.userId;
    if (job_type === 'UPDATE_USER_WORKSPACE') {
        await authServices.updateUser({ lastWorkspaceId: job.data.workspaceId }, userId);
    };
}, {
    connection: redisConnection,
    settings: {
        backoffStrategy: (attemptsMade, type, err, job) => {
            const base = 1000;   // your existing 1000ms
            const max = 30000;   // hard ceiling, don't let it grow forever
            const cap = Math.min(max, base * 2 ** attemptsMade);
            return Math.random() * cap; // Full Jitter
        },
    }
});

generalWorker.on('completed', (job) => {
    console.log(`Job ${job.name} bearing Id ${job.id} completed successfully`)
});

generalWorker.on('failed', (job, error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error(`Job ${job?.id ?? 'unknown'} failed`);
    console.error('Job name:', job?.name);
    console.error('Job data:', job?.data);
    console.error('Error message:', errorMessage);

    if (errorStack) {
        console.error('Error stack:', errorStack);
    }
});