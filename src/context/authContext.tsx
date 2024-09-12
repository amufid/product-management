'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { baseURL } from '@/lib/accessToken';

interface AuthState {
   isAuthenticated: boolean;
   user: string | null;
   accessToken: string | null;
}

type Action =
   | { type: 'LOGIN'; payload: { user: string; accessToken: string } }
   | { type: 'LOGOUT' }

const initialState: AuthState = {
   isAuthenticated: false,
   user: null,
   accessToken: null,
};

const authReducer = (state: AuthState, action: Action): AuthState => {
   switch (action.type) {
      case 'LOGIN':
         return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
            accessToken: action.payload.accessToken,
         }
      case 'LOGOUT':
         return {
            ...state,
            isAuthenticated: false,
            user: null,
            accessToken: null,
         }
      default:
         return state;
   }
}

interface AuthContextType {
   state: AuthState;
   login: (user: string, accessToken: string) => void;
   logout: () => void;
}

export const AuthContext = createContext<AuthContextType | any>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [state, dispatch] = useReducer(authReducer, initialState);

   const login = (user: string, accessToken: string) => {
      dispatch({ type: 'LOGIN', payload: { user, accessToken } });
      Cookies.set('accessToken', accessToken)
      Cookies.set('user', user)
   }

   const logout = () => {
      dispatch({ type: 'LOGOUT' })
      Cookies.remove('accessToken')
      Cookies.remove('user')
   }

   const accessToken = Cookies.get('accessToken')

   useEffect(() => {
      if (accessToken) {
         const getUserLoginName = async () => {
            const res = await fetch(`${baseURL}/user/0`, {
               method: 'GET',
               headers: {
                  'Authorization': `Bearer ${accessToken}`
               }
            })

            if (!res) {
               toast.error('Gagal mengambil data nama user!')
            }

            const { data } = await res.json()
            login(data.username, accessToken)
         }
         getUserLoginName()
      }
   }, [accessToken]);

   return (
      <AuthContext.Provider value={{ state, login, logout }}>
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      toast.error('Terjadi kesalahan!');
   }
   return context;
}
