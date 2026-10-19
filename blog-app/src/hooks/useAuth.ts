import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth(){
    const context = useContext(AuthContext)

    if (context === undefined){
        throw new Error("useAuth need a AuthProvider")
    }

    return context
}