import { useEffect, useState } from "react";
import { useSocket } from "../../../context/socketContext";

type PresenceUser = {
    id: string;
    username: string;
    img: string;
    socketId: string;
};

export function useOnlinePresence(roomId: string | undefined) {
    const socket = useSocket();
    const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);

    useEffect(() => {
        if (!socket || !roomId) return;

        const handlePresence = (users: PresenceUser[]) => setOnlineUsers(users);

        socket.on('presence:update', handlePresence);

        return () => {
            socket.off("presence:update", handlePresence);
        };
    }, [socket, roomId]);

    return onlineUsers;
}