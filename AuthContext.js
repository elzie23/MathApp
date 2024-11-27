import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; 
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        setUser(currentUser); 
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    
    return () => unsubscribe();
  }, []);

  
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setUser(userCredential.user); 
    } catch (error) {
      console.error("Error logging in: ", error.message);
    }
  };

  
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    signOut(auth); // Firebase sign-out
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
