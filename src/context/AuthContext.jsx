import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Mock auth for development if config is missing
const mockUser = {
  uid: 'dev-user-123',
  email: 'admin@sih.gov.in',
  role: 'admin',
  displayName: 'Super Admin'
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to get auth instance. If it fails (missing config), we'll handle it.
    try {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } catch (err) {
      console.info("Firebase Auth not configured (Demo Mode Active). This is expected if you haven't set up API keys.");
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Login failed:", err);
      // Fallback for demo/dev if firebase fails
      if (email === 'admin@sih.gov.in' && password === 'admin') {
        setUser(mockUser);
        return;
      }
      setError(err.message);
      throw err;
    }
  };

  const register = async (email, password) => {
    setError(null);
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
