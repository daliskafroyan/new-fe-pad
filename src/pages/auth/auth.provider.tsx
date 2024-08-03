import api from "@/api";
import { useLocalStorage } from "@/lib/utils";
import { ReactNode, createContext, useCallback, useMemo } from "react";

const TOKEN_KEY = "token";

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        config.headers['x-pendapatan'] = `${token.replace(/"/g, "")}`;
    } else {
        delete config.headers['x-pendapatan'];
    }
    return config;
});

export interface AuthContextType {
    token: string | undefined;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: undefined,
    login: async (token: string) => {
        if (!token) {
            console.log("token is empty", token);
        }
        console.warn("login function not implemented");
    },
    logout: () => {
        console.warn("logout function not implemented");
    },
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useLocalStorage<string | undefined>(TOKEN_KEY, undefined);

    const login = useCallback(
        async (data: string) => {
            setToken(data);
        },
        [setToken],
    );

    const logout = useCallback(() => {
        setToken(undefined);
    }, [setToken]);

    const value = useMemo(
        () => ({
            token,
            login,
            logout,
        }),
        [login, logout, token],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};