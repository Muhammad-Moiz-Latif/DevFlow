import express, { type Response } from 'express';
import { router as AuthRoutes } from './modules/auth/routes';

const app = express();
const PORT = 3000;

app.use('/api/auth', AuthRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});


