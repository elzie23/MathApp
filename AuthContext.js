import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig'; // Make sure this is correctly set up
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Watch for auth state changes (e.g., when the user logs in or logs out)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        setUser(currentUser); // Store user data in state
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // Login function using Firebase authentication
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setUser(userCredential.user); // Set the logged-in user
    } catch (error) {
      console.error("Error logging in: ", error.message);
    }
  };

  // Logout function using Firebase sign-out
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
