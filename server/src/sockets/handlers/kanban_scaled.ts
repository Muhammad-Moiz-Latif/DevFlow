import { redisClient } from '../../redis/client';
import type { Server, Socket } from "socket.io";

type PresenceUser = { id: string, username: string, img: string, socketId: string };
type DragAndDropUser = { socketId: string, sourceId: string, targetId: string | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' };

// ---- Presence (Redis-backed, shared across instances) ----

async function getRoomPresence(roomId: string): Promise<PresenceUser[]> {
    const raw = await redisClient.hgetall(`presence:${roomId}`);
    return Object.values(raw).map((v) => JSON.parse(v));
}

async function addToPresence(roomId: string, socketId: string, user: PresenceUser) {
    await redisClient.hset(`presence:${roomId}`, socketId, JSON.stringify(user));
}

async function removeFromPresence(roomId: string, socketId: string) {
    await redisClient.hdel(`presence:${roomId}`, socketId);
}

// ---- Drag-and-drop (Redis-backed, shared across instances) ----

async function getRoomDragDropEvents(roomId: string): Promise<DragAndDropUser[]> {
    const raw = await redisClient.hgetall(`dragdrop:${roomId}`);
    return Object.values(raw).map((v) => JSON.parse(v));
}

async function setDragDropEvent(roomId: string, socketId: string, event: DragAndDropUser) {
    await redisClient.hset(`dragdrop:${roomId}`, socketId, JSON.stringify(event));
}

async function removeDragDropEvent(roomId: string, socketId: string) {
    await redisClient.hdel(`dragdrop:${roomId}`, socketId);
}

// ---- Shared cleanup on leave/disconnect ----

async function removeFromRoom(socket: Socket, io: Server, roomId: string) {
    const socketId = socket.id;

    await Promise.all([
        removeFromPresence(roomId, socketId),
        removeDragDropEvent(roomId, socketId),
    ]);

    const [usersPresence, dragdropData] = await Promise.all([
        getRoomPresence(roomId),
        getRoomDragDropEvents(roomId),
    ]);

    io.to(roomId).emit('presence:update', usersPresence);
    io.to(roomId).emit('update:drag-drop-event', dragdropData);
}

export const registerKanbanHandlers = (socket: Socket, io: Server) => {

    socket.on('join-kanban-room', async (roomId) => {
        socket.join(roomId);
        socket.data.currentRoom = roomId;
        console.log(`${socket.data.user.username} has joined kanban-room having Id: ${roomId}`);

        const user: PresenceUser = { ...socket.data.user, socketId: socket.id };
        await addToPresence(roomId, socket.id, user);

        const users = await getRoomPresence(roomId);
        io.to(roomId).emit('presence:update', users);
    });

    socket.on('leave-kanban-room', async (roomId) => {
        socket.leave(roomId);
        await removeFromRoom(socket, io, roomId);
        console.log(`${socket.data.user.username} has left kanban-room having Id: ${roomId}`);
        socket.data.currentRoom = undefined;
    });

    // Fire-and-forget relay — no storage, no state, just pass the coordinates through
    socket.on('handle-mouse-movement', ({ roomId, x, y }) => {
        socket.to(roomId).emit('update:mouse', {
            socketId: socket.id,
            x,
            y,
        });
    });

    socket.on('on-drag-start', async ({ sourceId, targetId }) => {
        const roomId = socket.data.currentRoom;
        const socketId = socket.id;
        if (!roomId || !socketId) return;

        const currentEvents = await getRoomDragDropEvents(roomId);
        const alreadyDragged = currentEvents.some((entry) => entry.sourceId === sourceId);
        if (alreadyDragged) return;

        await setDragDropEvent(roomId, socketId, { socketId, sourceId, targetId });

        const data = await getRoomDragDropEvents(roomId);
        socket.to(roomId).emit('update:drag-drop-event', data);
    });

    socket.on('on-drag-move', async ({ sourceId, targetId }) => {
        const roomId = socket.data.currentRoom;
        const socketId = socket.id;
        if (!roomId) return;

        await setDragDropEvent(roomId, socketId, { socketId, sourceId, targetId });

        const data = await getRoomDragDropEvents(roomId);
        socket.to(roomId).emit('update:drag-drop-event', data);
    });

    socket.on('on-drag-end', async () => {
        const roomId = socket.data.currentRoom;
        const socketId = socket.id;
        if (!roomId) return;

        await removeDragDropEvent(roomId, socketId);

        const data = await getRoomDragDropEvents(roomId);
        socket.to(roomId).emit('update:drag-drop-event', data);
    });

};

export const handleKanbanDisconnect = async (socket: Socket, io: Server) => {
    const roomId = socket.data.currentRoom;
    if (!roomId) return;
    await removeFromRoom(socket, io, roomId);
};