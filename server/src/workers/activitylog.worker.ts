import { Worker, type Job } from "bullmq";
import { redisConnection } from "../redis/client";
import { issueServices } from "../modules/issue/services";
import { LogType } from "../db/schema/activity-logs";

type LogTypeEnum = typeof LogType.enumValues[number];

const activityLogWorker = new Worker('activity-log', async (job: Job<any, any, string>) => {

    await issueServices.addToActivityLogs({ issueId: job.data.issueId, workspaceId: job.data.workspaceId, actorId: job.data.actorId, logType: job.name as LogTypeEnum, oldValue: job.data.oldValue ?? null, newValue: job.data.newValue ?? null });

}, {
    connection: redisConnection
    , settings: {
        backoffStrategy: (attemptsMade, type, err, job) => {
            const base = 1000;   // your existing 1000ms
            const max = 30000;   // hard ceiling, don't let it grow forever
            const cap = Math.min(max, base * 2 ** attemptsMade);
            return Math.random() * cap; // Full Jitter
        },
    }
});

activityLogWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`)
});

activityLogWorker.on('failed', (job, error) => {
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

export default activityLogWorker;
