
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export interface AuthContextData {
    signed: boolean;
    user: AuthResponse['user'] | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}
