import { useState, useEffect, createContext, ReactNode } from 'react'

import { auth, firebase } from '../services/firebase';

type AuthContextProviderProps = {
  children?: ReactNode
}


type userType = {
    id: string,
    name: string,
    avatar: string
  }
  
type AuthContextType = {
    user: userType | undefined,
    signInWithGoogle: () => Promise<void>
}
export const AuthContext = createContext({} as AuthContextType)


export function AuthContextProvider(props: AuthContextProviderProps) { 
  const [user, setUser] = useState<userType>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => { 
      if(user) {
        const { displayName, photoURL, uid } = user;
  
        if (!displayName || !photoURL ) 
          throw new Error("Algumas informações não foram encontradas na sua conta Google")        
                  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
      }
    })

    return () => { 
      unsubscribe()
    }
    
  },[])

  async function signInWithGoogle() { 
    const result = await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    
    if(result && result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL ) 
        throw new Error("Algumas informações não foram encontradas na sua conta Google")        
                
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
    }
  }

    return (
        <AuthContext.Provider value={{user, signInWithGoogle}}>
          {props.children}
        </AuthContext.Provider>
    )
}