import React, {createContext, useContext, useEffect, useState} from 'react'
import api from '../services/api'

interface AuthContextProps{
    signed: boolean;
    user: object | null;
    doLogin(values: CredentialsProps): Promise<void>;
    doLogout(): void;
}

interface CredentialsProps{
    email: string;
    password: string;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC = ({children}) => {

    const [user, setUser] = useState<object | null>(null); 
    
    useEffect( () => {
        const storagedUser = localStorage.getItem('@FarmBuy:user');
        const storagedToken = localStorage.getItem('@FarmBuy:token');

        if(storagedToken && storagedUser){
            setUser(JSON.parse(storagedUser));
            api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        }
    }, [])

    async function doLogin(credentials: CredentialsProps){    
        await api.post('login', credentials).then( response => {
        
            localStorage.setItem('@FarmBuy:user', JSON.stringify(response.data.user));
            localStorage.setItem('@FarmBuy:token', response.data.token.token);
            api.defaults.headers.Authorization = `Bearer ${response.data.token.token}`;

            setUser(response.data.user);

        }).catch( error => {
            throw new Error(JSON.stringify(error.response.data.errors))
        });
    }

    function doLogout(){
        localStorage.removeItem('@FarmBuy:user');
        localStorage.removeItem('@FarmBuy:token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{signed: Boolean(user), user, doLogin, doLogout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

export function useAuth(){
    const context = useContext(AuthContext);
    return context;
}
