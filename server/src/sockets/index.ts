import type { Server } from "socket.io";
import { verifyAuth } from "./middlewares/auth";
import { handleKanbanDisconnect, registerKanbanHandlers } from "./handlers/kanban";

export const initializeSocket = (io: Server) => {

    io.use(verifyAuth);

    io.on('connection', (socket) => {
        console.log(`User has connected with socketId: ${socket.id}`);
        console.log(socket.data.user);
        // some request handlers
        registerKanbanHandlers(socket, io);

        socket.on('disconnect', () => {
            handleKanbanDisconnect(socket, io);
            console.log(`User disconnected: ${socket.id}`);
        });
    });

}