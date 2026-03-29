import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import "dotenv/config";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET!;
    if (!header) {
        return res.status(404).json({
            success: false,
            message: "Unauthorized access, authorization header is missing"
        });
    };

    const bearerToken = header?.split(" ");
    const token = bearerToken[1];

    if (!token) {
        return res.status(404).json({
            success: false,
            message: "Unauthorized access, access token is missing"
        });
    };

    jwt.verify(token, access_token_secret, (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
            return res.status(401).json({
                success: false,
                message: 'Token invalid or expired'
            });
        };

        req.user = {
            id: decoded.id
        };

        next();
    });
};