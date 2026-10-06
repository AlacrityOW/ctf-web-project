import { createContext, useContext, useState, useEffect } from 'react';
import api, {setAccessTokenInMemory} from '../api/axios.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Automatic background session-restore on app boot
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.post('/api/auth/refresh');
        const { accessToken } = response.data;
        
        setAccessTokenInMemory(accessToken);
        setIsAuthenticated(true); // User is successfully authenticated via cookie!
      } catch (err) {
        setIsAuthenticated(false); // No valid cookie found
      } finally {
        setIsLoading(false); // Stop showing loading state
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login",{email,password})
      const {accessToken, success} = response.data
      if(success || accessToken){
        setAccessTokenInMemory(accessToken)
        setIsAuthenticated(true)
        return success
      }
      return false
    } catch (error) {
      console.log(error)
      setIsAuthenticated(false)
      return false
    }
  };
  const register = async (form) =>{
    try {
      console.log("Auth Context : ",form)
      const response = await api.post("/api/auth/register",form)
      if(response.data.success){
        console.log("Account Registered")
        return true
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }
  const logout = async () => {
    try {
      // Hit your backend logout endpoint to clear the database JTI row and cookie
      await api.post('/api/auth/logout'); 
    } catch (error) {
      console.log("Logout warning:", error);
    } finally {
      setAccessTokenInMemory(null);
      setIsAuthenticated(false); //  Flipped back to secure false layout
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}