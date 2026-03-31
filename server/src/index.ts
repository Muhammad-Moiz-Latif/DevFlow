import express from 'express';
import { router as AuthRoutes } from './modules/auth/routes';
import { router as WorkspaceRoutes } from './modules/workspace/routes';
import { router as ProjectRoutes } from './modules/projects/routes';
import { router as IssueRoutes } from './modules/issue/routes';
import cookieParser from 'cookie-parser';
import passport from 'passport';




const app = express();

// express middleware which parses incoming JSON data from req into json object and stored in req.body
app.use(express.json());

// parses application/form-data only (converts string into js notation)
app.use(express.urlencoded({ extended: true }));

// middleware for cookies
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

app.use('/api/auth', AuthRoutes);
app.use('/api/workspace', WorkspaceRoutes);
app.use('/api/workspace/:workspaceId', ProjectRoutes);
app.use('/api/workspace/:workspaceId/project/:projectId', IssueRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});


