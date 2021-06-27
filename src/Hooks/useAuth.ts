import {useContext} from 'react';
import {AuthContext} from '../Contexts/AuthContexts'

export function useAuth(){
    const value = useContext(AuthContext);

    return value;
}