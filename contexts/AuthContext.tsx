'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, ADMIN_EMAIL } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                try {
                    // Get user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        // Force admin role if email matches (case-insensitive), otherwise trust Firestore
                        const role = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : userData.role;

                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email!,
                            role: role,
                            createdAt: userData.createdAt?.toDate() || new Date(),
                        });
                    } else {
                        // Create user document if it doesn't exist
                        const role = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : 'USER';
                        const newUser: User = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email!,
                            role,
                            createdAt: new Date(),
                        };

                        await setDoc(doc(db, 'users', firebaseUser.uid), {
                            email: firebaseUser.email,
                            role,
                            createdAt: new Date(),
                        });

                        setUser(newUser);
                    }
                } catch (error: any) {
                    console.error('Error fetching user data:', error);
                    // If offline or error, create a temporary user object with default role
                    const role = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'ADMIN' : 'USER';
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email!,
                        role,
                        createdAt: new Date(),
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const role = email === ADMIN_EMAIL ? 'ADMIN' : 'USER';

        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            role,
            createdAt: new Date(),
        });
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}
