import type { Server, Socket } from "socket.io";

type PresenceUser = { id: string, username: string, img: string, socketId: string };
type CoordinateUser = { socketId: string, x: number, y: number };
type DragAndDropUser = { socketId: string, sourceId: string, targetId: string | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' };

const roomPresence = new Map<string, Map<string, PresenceUser>>();
const roomCoordinates = new Map<string, Map<string, CoordinateUser>>();
const dragAndDropEvents = new Map<string, Map<string, DragAndDropUser>>();
const dragMoveThrottle = new Map<string, number>();

function removeFromRoom(socket: Socket, io: Server, roomId: string) {
    const presenceRoom = roomPresence.get(roomId);
    const coordsRoom = roomCoordinates.get(roomId);
    const dragdropEvents = dragAndDropEvents.get(roomId);
    if (!presenceRoom || !coordsRoom || !dragdropEvents) return;

    presenceRoom.delete(socket.id);
    coordsRoom.delete(socket.id);
    dragdropEvents?.delete(socket.id);
    dragMoveThrottle.delete(socket.id);

    if (presenceRoom.size === 0) {
        roomPresence.delete(roomId); // ✅ delete from the OUTER map
    }
    if (coordsRoom.size === 0) {
        roomCoordinates.delete(roomId); // ✅ separate check, not else-if
    }
    if (dragdropEvents.size === 0) {
        dragdropEvents.delete(roomId); // ✅ separate check, not else-if
    }

    const usersPresence = Array.from(presenceRoom.values());
    const usersCoordinates = Array.from(coordsRoom.values());
    const dragdropData = Array.from(dragdropEvents.values());

    io.to(roomId).emit('presence:update', usersPresence);
    io.to(roomId).emit('update:mouse', usersCoordinates);
    io.to(roomId).emit('update:drag-drop-event', dragdropData);

}

export const registerKanbanHandlers = (socket: Socket, io: Server) => {

    socket.on('join-kanban-room', (roomId) => {
        socket.join(roomId);
        socket.data.currentRoom = roomId; // ← remember it for later cleanup
        console.log(`${socket.data.user.username} has joined kanban-room having Id: ${roomId}`);

        if (!roomPresence.has(roomId)) {
            roomPresence.set(roomId, new Map());
        };

        if (!roomCoordinates.has(roomId)) {
            roomCoordinates.set(roomId, new Map());
        };

        if (!dragAndDropEvents.has(roomId)) {
            dragAndDropEvents.set(roomId, new Map());
        };

        roomCoordinates.get(roomId)?.set(socket.id, {
            x: 0,
            y: 0,
            socketId: socket.id
        });

        roomPresence.get(roomId)?.set(socket.id, {
            ...socket.data.user,
            socketId: socket.id
        });

        const users = Array.from(roomPresence.get(roomId)?.values() ?? []);
        io.to(roomId).emit('presence:update', users);
    });

    socket.on('leave-kanban-room', (roomId) => {
        socket.leave(roomId);           // actually leaves the socket.io room
        removeFromRoom(socket, io, roomId);
        console.log(`${socket.data.user.username} has left kanban-room having Id: ${roomId}`);
        socket.data.currentRoom = undefined; // they're no longer "in" a kanban room
    });

    socket.on('handle-mouse-movement', ({ roomId, x, y }) => {

        const room = roomCoordinates.get(roomId);
        if (!room) return;

        const user = room.get(socket.id);
        if (!user) return;

        user.x = x;
        user.y = y;

        const users = Array.from(room.values())

        socket.to(roomId).emit('update:mouse', users);
    });

    socket.on('on-drag-start', ({ sourceId, targetId }) => {
        const roomId = socket.data.currentRoom;
        const socketId = socket.id;
        const room = dragAndDropEvents.get(roomId);
        if (!room || !socketId) {
            return;
        };

        // Check if this issue is already being dragged by someone else
        const alreadyDragged = Array.from(room.values()).some(
            (entry) => entry.sourceId === sourceId
        );

        if (alreadyDragged) {
            return;
        };

        room.set(socketId, {
            socketId,
            sourceId,
            targetId
        });

        const data = Array.from(room.values());

        socket.to(roomId).emit('update:drag-drop-event', data);
    });

    socket.on('on-drag-move', ({ sourceId, targetId }) => {
        const roomId = socket.data.currentRoom;
        const socketId = socket.id;
        const room = dragAndDropEvents.get(roomId);
        if (!room) return;

        const now = Date.now();
        const lastEmit = dragMoveThrottle.get(socketId) ?? 0;
        if (now - lastEmit < 75) {
            return;
        }

        dragMoveThrottle.set(socketId, now);

        room.set(socketId, {
            socketId,
            sourceId,
            targetId
        });

        const data = Array.from(room.values());

        socket.to(roomId).emit('update:drag-drop-event', data);
    });

    socket.on('on-drag-end', () => {
        const roomId = socket.data.currentRoom;
        const socketId = socket.id;
        const room = dragAndDropEvents.get(roomId);
        if (!room) return;

        const dragdropEvent = room.get(socketId);
        if (!dragdropEvent) return;

        room.delete(socketId);

        const data = Array.from(room.values());

        socket.to(roomId).emit('update:drag-drop-event', data);
    });

};

export const handleKanbanDisconnect = (socket: Socket, io: Server) => {
    const roomId = socket.data.currentRoom;
    if (!roomId) return; // already left explicitly, or never joined — nothing to do
    removeFromRoom(socket, io, roomId);
};