import z from 'zod';
import express, { type Request, type Response, type NextFunction } from 'express';

const app = express();

app.use(express.json());

export function validateBody(schema: z.ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.cause,
                });
            }
            next(error);
        }
    }
};

