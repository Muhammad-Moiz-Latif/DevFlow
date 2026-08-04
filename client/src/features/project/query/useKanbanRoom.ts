import { useEffect } from "react";
import { useSocket } from "../../../context/socketContext";

export const useKanbanRoom = (roomId: string) => {
    const socket = useSocket();

    useEffect(() => {
        if (!socket || !roomId) return;
        socket.emit('join-kanban-room', roomId);
        return () => {
            socket.emit('leave-kanban-room', roomId);
        };
    }, [socket, roomId]);
};