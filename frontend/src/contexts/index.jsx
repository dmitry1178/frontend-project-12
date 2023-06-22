import { createContext, useContext } from 'react';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);
export const ChatApiContext = createContext({});
export const useChatApi = () => useContext(ChatApiContext);

export default AuthContext;
