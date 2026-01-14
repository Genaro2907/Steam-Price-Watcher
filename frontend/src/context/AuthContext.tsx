import { AuthContextData, AuthResponse, SignUpData } from "@/interfaces/auth.interfaces";
import api from "@/services/api";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export const AuthProvider = ({ children}: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = () => {
            const storagedUser = localStorage.getItem('steam-watcher-user');
            const storagedToken = localStorage.getItem('steam-watcher-token');

            if(storagedUser && storagedToken) {
                setUser(JSON.parse(storagedUser));
            }
            setLoading(false);
        };
        loadStorageData();
    }, []);

    async function signIn(email: string, pass: string) {
        const response = await api.post<AuthResponse>('/auth/login', {
            email,
            password: pass
        });

        const { token, user } = response.data;

        localStorage.setItem('steam-watcher-token', token);
        localStorage.setItem('steam-watcher-user', JSON.stringify(user));

        setUser(user);
    }

    async function signUp(data: SignUpData) {
        const response = await api.post<AuthResponse>('/auth/register', data);

        const { token, user} = response.data;

        localStorage.setItem('steam-watcher-token', token);
        localStorage.setItem('steam-watcher-user', JSON.stringify(user));

        setUser(user);
    }

    function signOut() {
        localStorage.clear();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{signed: !!user, user, signIn, signUp , signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}