import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  ApplicationVerifier
} from 'firebase/auth';
import { auth, firestore } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { checkNetworkStatus } from '../utils/network';

interface AuthContextType {
  currentUser: User | null;
  isOnline: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  loginWithPhoneNumber: (phoneNumber: string, appVerifier: ApplicationVerifier) => Promise<any>;
  confirmOTP: (confirmationResult: any, code: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  getUserData: (userId: string) => Promise<any>;
}

// Initialize context with undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const updateNetworkStatus = async () => {
      const onlineStatus = await checkNetworkStatus();
      setIsOnline(onlineStatus);
    };

    updateNetworkStatus();
    const interval = setInterval(updateNetworkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
      const userRef = doc(firestore, 'users', auth.currentUser.uid);
      await setDoc(userRef, { displayName, email });
    }
    return userCredential.user;
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const loginWithPhoneNumber = async (phoneNumber: string, appVerifier: ApplicationVerifier) => {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  };

  const confirmOTP = async (confirmationResult: any, code: string) => {
    const userCredential = await confirmationResult.confirm(code);
    return userCredential.user;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const getUserData = async (userId: string) => {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data();
  };

  const value: AuthContextType = {
    currentUser,
    isOnline,
    signup,
    login,
    loginWithPhoneNumber,
    confirmOTP,
    loginWithGoogle,
    logout,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};