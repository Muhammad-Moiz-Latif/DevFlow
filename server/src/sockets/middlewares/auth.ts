import { access } from "node:fs";
import type { Socket } from "socket.io";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const verifyAuth = (socket: Socket, next: (err?: Error) => void) => {
    try {
        const accessToken = socket.handshake.auth.token;
        if (!accessToken) {
            next(new Error("Unauthorized access"));
        };
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || "") as { id: string, username: string, img: string };
        socket.data.user = payload
        next();
    } catch (error) {
        next(new Error("Unauthorized access"));
    }
};