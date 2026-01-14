
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export interface SignUpData {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface AuthContextData {
    signed: boolean;
    user: AuthResponse['user'] | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}
