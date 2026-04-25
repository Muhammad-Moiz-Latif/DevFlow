import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";


interface authState {
    access_token: string,
    _id: string,
    img: string,
    username: string,
};

interface authContextType {
    auth: authState | null,
    setAuth: Dispatch<SetStateAction<authState | null>>
};


export const authContext = createContext<authContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<authState | null>(null);

    return <authContext.Provider value={{ auth, setAuth }}>
        {children}
    </authContext.Provider>
};

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
