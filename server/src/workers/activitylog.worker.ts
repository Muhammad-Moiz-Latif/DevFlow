import { Worker, type Job } from "bullmq";
import { redisConnection } from "../redis/client";
import { issueServices } from "../modules/issue/services";
import { LogType } from "../db/schema/activity-logs";

type LogTypeEnum = typeof LogType.enumValues[number];

const activityLogWorker = new Worker('activity-log', async (job: Job<any, any, string>) => {

    console.log('Job received: ', job.name, job.data);

    if (job.name === 'ASSIGNEE_CHANGED') {
        await issueServices.addToActivityLogs(job.data.issueId, job.data.workspaceId, job.data.actorId, job.name as LogTypeEnum);
    } else if (job.name === 'PRIORITY_CHANGED') {
        await issueServices.addToActivityLogs(job.data.issueId, job.data.workspaceId, job.data.actorId, job.name as LogTypeEnum, job.data.oldValue, job.data.newValue);
    } else if (job.name === 'STATUS_CHANGED') {
        await issueServices.addToActivityLogs(job.data.issueId, job.data.workspaceId, job.data.actorId, job.name as LogTypeEnum, job.data.oldValue, job.data.newValue);
    }

}, { connection: redisConnection });

activityLogWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`)
});

activityLogWorker.on('failed', (job, error) => {
    console.error(`Job ${job?.id} failed with error: ${error.message}`)
});

export default activityLogWorker;
