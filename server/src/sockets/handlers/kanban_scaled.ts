import { redisClient } from '../../redis/client';
import type { Server, Socket } from "socket.io";

type PresenceUser = { id: string, username: string, img: string, socketId: string };
type DragAndDropUser = { socketId: string, sourceId: string, targetId: string | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' };

// ---- Presence (Redis-backed, shared across instances) ----

async function getRoomPresence(roomId: string, io: Server): Promise<PresenceUser[]> {
    const raw = await redisClient.hgetall(`presence:${roomId}`);

    // ✅ Fetch full socket objects, then map to a Set of IDs for O(1) lookup
    const sockets = await io.in(roomId).fetchSockets();
    const activeSocketIds = new Set(sockets.map(socket => socket.id));

    const validUsers: PresenceUser[] = [];
    const staleSockets: string[] = [];

    for (const [socketId, userStr] of Object.entries(raw)) {
        if (activeSocketIds.has(socketId)) {
            validUsers.push(JSON.parse(userStr));
        } else {
            staleSockets.push(socketId);
        }
    }

    if (staleSockets.length > 0) {
        await redisClient.hdel(`presence:${roomId}`, ...staleSockets);
    }

    return validUsers;
}

async function addToPresence(roomId: string, socketId: string, user: PresenceUser) {
    await redisClient.hset(`presence:${roomId}`, socketId, JSON.stringify(user));
}

async function removeFromPresence(roomId: string, socketId: string) {
    await redisClient.hdel(`presence:${roomId}`, socketId);
}

// ---- Drag-and-drop (Redis-backed, shared across instances) ----

async function getRoomDragDropEvents(roomId: string, io: Server): Promise<DragAndDropUser[]> {
    const raw = await redisClient.hgetall(`dragdrop:${roomId}`);

    // ✅ Fetch full socket objects, map to Set of IDs
    const sockets = await io.in(roomId).fetchSockets();
    const activeSocketIds = new Set(sockets.map(socket => socket.id));

    const validEvents: DragAndDropUser[] = [];
    const staleSockets: string[] = [];

    for (const [socketId, eventStr] of Object.entries(raw)) {
        if (activeSocketIds.has(socketId)) {
            validEvents.push(JSON.parse(eventStr));
        } else {
            staleSockets.push(socketId);
        }
    }

    if (staleSockets.length > 0) {
        await redisClient.hdel(`dragdrop:${roomId}`, ...staleSockets);
    }

    return validEvents;
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
        getRoomPresence(roomId, io),
        getRoomDragDropEvents(roomId, io),
    ]);

    io.to(roomId).emit('presence:update', usersPresence);
    io.to(roomId).emit('update:drag-drop-event', dragdropData);
}

export const registerKanbanHandlers = (socket: Socket, io: Server) => {

    socket.on('join-kanban-room', async (roomId) => {

        console.log('================ JOIN ================');

        // Optional: Pre-cleanup if they are joining a new room without explicitly leaving the old one
        const previousRoom = socket.data.currentRoom;
        if (previousRoom && previousRoom !== roomId) {
            socket.leave(previousRoom);
            await removeFromRoom(socket, io, previousRoom);
        }

        console.log('INSTANCE:', process.pid);
        console.log('SOCKET:', socket.id);
        console.log('ROOM:', roomId);
        console.log('USER:', socket.data.user);

        socket.join(roomId);
        socket.data.currentRoom = roomId;

        const user: PresenceUser = {
            ...socket.data.user,
            socketId: socket.id
        };

        console.log('ADDING PRESENCE:', user);

        await addToPresence(roomId, socket.id, user);

        const raw = await redisClient.hgetall(`presence:${roomId}`);

        console.log('REDIS PRESENCE:', raw);

        const users = await getRoomPresence(roomId, io);

        console.log('FINAL PRESENCE:', users);

        // ✅ Updated console log to map the fetchSockets array down to just the IDs
        const currentSockets = await io.in(roomId).fetchSockets();
        console.log('ROOM SOCKETS:', currentSockets.map(s => s.id));

        io.to(roomId).emit('presence:update', users);

        console.log('========================================');
    });

    socket.on('leave-kanban-room', async (roomId) => {
        socket.leave(roomId);
        await removeFromRoom(socket, io, roomId);
        console.log(`${socket.data.user?.username} has left kanban-room having Id: ${roomId}`);
        socket.data.currentRoom = undefined;
    });

    socket.on('handle-mouse-movement', ({ roomId, x, y }) => {
        socket.to(roomId).volatile.emit('update:mouse', {
            socketId: socket.id,
            x,
            y,
        });
    });

    socket.on('on-drag-start', async ({ sourceId, targetId }) => {
        const roomId = socket.data.currentRoom;
        const socketId = socket.id;
        if (!roomId || !socketId) return;

        const currentEvents = await getRoomDragDropEvents(roomId, io);
        const alreadyDragged = currentEvents.some((entry) => entry.sourceId === sourceId);
        if (alreadyDragged) return;

        await setDragDropEvent(roomId, socketId, { socketId, sourceId, targetId });

        const data = await getRoomDragDropEvents(roomId, io);
        socket.to(roomId).emit('update:drag-drop-event', data);
    });

    socket.on('on-drag-move', async ({ sourceId, targetId }) => {
        const roomId = socket.data.currentRoom;
        const socketId = socket.id;
        if (!roomId) return;

        await setDragDropEvent(roomId, socketId, { socketId, sourceId, targetId });

        const data = await getRoomDragDropEvents(roomId, io);
        socket.to(roomId).emit('update:drag-drop-event', data);
    });

    socket.on('on-drag-end', async () => {
        const roomId = socket.data.currentRoom;
        const socketId = socket.id;
        if (!roomId) return;

        await removeDragDropEvent(roomId, socketId);

        const data = await getRoomDragDropEvents(roomId, io);
        socket.to(roomId).emit('update:drag-drop-event', data);
    });

};

export const handleKanbanDisconnect = async (socket: Socket, io: Server) => {
    const roomId = socket.data.currentRoom;
    if (!roomId) return;
    await removeFromRoom(socket, io, roomId);
};