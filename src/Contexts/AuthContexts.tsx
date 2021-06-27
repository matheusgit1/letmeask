import {createContext, ReactNode} from 'react';
import {useState, useEffect} from 'react'

import {auth, firebase} from '../Services/firebase';


type user = {
    id: string,
    name: string,
    avatar: string,
}
  
type AuthContextType = {
    user: user | undefined, 
    singInWithGoogle: () => Promise<void>;
}

type AuthContextProvidersProps = {
    children: ReactNode,
}
  
export const AuthContext = createContext({} as AuthContextType );

export function AuthContextProvider(props: AuthContextProvidersProps){

    const [user, setUser] = useState<user>();
    
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        const {displayName, photoURL, uid} = user;
        if(!displayName || !photoURL){
          throw new Error('Missing information in your google acounts'); 
        }

        setUser({
          id: uid, name: displayName, avatar: photoURL,
        })
      }
    })

    return () => {
      unsubscribe();
    }

  },[]);

  async function singInWithGoogle(){

    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await auth.signInWithPopup(provider)
    //result.then(result=>{
      if(result.user){
        const {displayName, photoURL, uid} = result.user;
        if(!displayName || !photoURL){
          throw new Error('Missing information in your google acounts'); 
        }

        setUser({
          id: uid, name: displayName, avatar: photoURL,
        })
      }
      //console.log(result);
      //history.push('/rooms/new');
    //};
 
    

  }

    return(
        <AuthContext.Provider value={{user, singInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>

    );
}