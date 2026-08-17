import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { router as AuthRoutes } from './modules/auth/routes';
import { router as WorkspaceRoutes } from './modules/workspace/routes';
import { router as ProjectRoutes } from './modules/projects/routes';
import { router as IssueRoutes } from './modules/issue/routes';
import { router as CommentRoutes } from './modules/comment/routes';
import { router as MemberRoutes } from './modules/members/routes';
import { router as WorkspaceInvitationRoutes } from './modules/invitations/routes';
import { router as InvitationAcceptRoutes } from './modules/invitations/accept-routes';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './redis/client';
import './queues/notification.queue'
import './queues/activitylog.queue'
import './queues/general.queue'
import Redis from 'ioredis';
import { initializeSocket } from './sockets';
import { createAdapter } from "@socket.io/redis-adapter";

if (process.env.RUN_WORKERS_INLINE === 'true') {
    console.log('Starting workers inline (single-service mode)...');
    import('./workers/notification.worker');
    import('./workers/activitylog.worker');
    import('./workers/generalJobs.worker');
}




const app = express();
const httpServer = createServer(app);

// the mouth (messages are yelled into redis) via a new redis connection
const pubClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
// the ear (listening for messages from other servers)
const subClient = pubClient.duplicate();
export const io = new Server(httpServer, {
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: false,
    },
    cors: {
        origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
    }
});

// redis adapter
io.adapter(createAdapter(
    pubClient,
    subClient
));


// express middleware which parses incoming JSON data from req into json object and stored in req.body
app.use(express.json());

// parses application/form-data only (converts string into js notation)
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// middleware for cookies
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

app.use('/api/auth', AuthRoutes);
app.use('/api/workspace', WorkspaceRoutes);
app.use('/api/workspace/:workspaceId', ProjectRoutes);
app.use('/api/workspace/:workspaceId/members', MemberRoutes);
app.use('/api/workspace/:workspaceId/invitations', WorkspaceInvitationRoutes);
app.use('/api/invitations', InvitationAcceptRoutes);
app.use('/api/workspace/:workspaceId/project/:projectId', IssueRoutes);
app.use('/api/workspace/:workspaceId/issue/:issueId', CommentRoutes);

const PORT = process.env.PORT || 3000;

initializeSocket(io);

httpServer.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});