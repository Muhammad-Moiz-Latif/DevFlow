console.log('Starting BullMQ Workers...');

// Initialize Redis connection
import './redis/client';

// Import all workers to start processing jobs
import './workers/notification.worker';
import './workers/activitylog.worker';
import './workers/generalJobs.worker';

console.log('All workers are running and listening for jobs.');