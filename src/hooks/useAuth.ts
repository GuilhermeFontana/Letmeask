import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContexts"; 

export function useAuth() {
    return useContext(AuthContext)
}