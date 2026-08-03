import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';
import { useAuthStore } from "../stores/auth-store";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (!accessToken) return;
        const s = io(import.meta.env.VITE_SOCKET_URL, {
            auth: { token: accessToken },
        });


        setSocket(s);

        return () => {
            s.disconnect(); // only on logout / provider unmount
            setSocket(null)
        };
    }, [accessToken]);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
}

export const useSocket = () => {
    return useContext(SocketContext)
};