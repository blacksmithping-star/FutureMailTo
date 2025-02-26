import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  async function signInAnonymous() {
    try {
      const result = await signInAnonymously(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Error during anonymous sign in:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setToken(null);
      localStorage.removeItem("authToken");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
  
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const newToken = tokenResult.token;
          const storedToken = localStorage.getItem("authToken");
  
          if (storedToken && storedToken !== newToken) {
            logout();
          }
  
          localStorage.setItem("authToken", newToken);
          setToken(newToken);
          //console.log("Token updated:", newToken);
        } catch (error) {
          console.error("Error fetching token:", error);
          setToken(null);
        }
      } else {
        setToken(null);
        localStorage.removeItem("authToken");
      }
  
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    token,
    logout,
    signInAnonymous
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 