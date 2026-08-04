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

        const handleCoordinates = (data: CoordinateUser[]) => {
            setUserCoordinates(data);
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