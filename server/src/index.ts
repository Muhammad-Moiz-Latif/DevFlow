import express from 'express';
import cors from 'cors';
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




const app = express();



// express middleware which parses incoming JSON data from req into json object and stored in req.body
app.use(express.json());

// parses application/form-data only (converts string into js notation)
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
