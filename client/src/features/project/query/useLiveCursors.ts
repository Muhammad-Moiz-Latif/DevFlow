import { useEffect, useRef, useState } from "react"
import { useSocket } from "../../../context/socketContext"

type CoordinateUser = {
    x: number,
    y: number,
    socketId: string;
};

export const useLiveCursors = (roomId: string) => {
    const socket = useSocket();
    const [userCoordinates, setUserCoordinates] = useState<CoordinateUser[]>([]);

    // Use a ref to track the last emit time to avoid spamming the server
    const lastEmitTime = useRef(0);

    useEffect(() => {
        if (!socket || !roomId) return;

        const handleMouseMove = (event: MouseEvent) => {
            const now = Date.now();
            // Throttle to roughly 20 frames per second (every 50ms)
            if (now - lastEmitTime.current > 50) {
                socket.emit('handle-mouse-movement', {
                    roomId,
                    x: event.clientX,
                    y: event.clientY
                });
                lastEmitTime.current = now;
            }
        };

        const handleCoordinates = (data: CoordinateUser[] | CoordinateUser) => {
            // Support two shapes from the server:
            // - an array of coordinates (legacy / broadcast full state)
            // - a single coordinate object (scaled / per-mouse-move updates)
            if (!data) return;
            if (Array.isArray(data)) {
                setUserCoordinates(data);
                return;
            }

            // single update: merge into the existing array
            setUserCoordinates((prev) => {
                const exists = prev.some((u) => u.socketId === data.socketId);
                if (exists) {
                    return prev.map((u) => u.socketId === data.socketId ? { ...u, x: data.x, y: data.y } : u);
                }
                return [...prev, data];
            });
        }

        window.addEventListener('mousemove', handleMouseMove);
        socket.on('update:mouse', handleCoordinates);

        return () => {
            socket.off('update:mouse', handleCoordinates);
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [socket, roomId]);

    return userCoordinates;
}