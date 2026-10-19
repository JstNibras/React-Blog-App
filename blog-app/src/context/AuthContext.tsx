import { createContext, useEffect, useState, type ReactNode } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "../firebase/config";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    async function register(email: string, password: string){
        await createUserWithEmailAndPassword(auth, email, password)
    }

    async function login(email: string, password: string){
        await signInWithEmailAndPassword(auth, email, password)
    }

    async function logout(){
        await signOut(auth)
    }

    return (
        <AuthContext.Provider value={{user, loading, register, login, logout}}>{children}</AuthContext.Provider>
    )
}