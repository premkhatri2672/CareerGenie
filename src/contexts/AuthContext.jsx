import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

/**
 * Clears cached analysis data when a different user signs in.
 * This prevents new users from seeing the previous user's dashboard data.
 */
const clearStaleUserData = (newUserId) => {
  const previousUserId = localStorage.getItem('careergenie_current_user_id');
  
  if (previousUserId && previousUserId !== newUserId) {
    // Different user detected — clear old cached data
    localStorage.removeItem('careergenie_analyses');
    localStorage.removeItem('careergenie_guest_user_id');
  }
  
  if (newUserId) {
    localStorage.setItem('careergenie_current_user_id', newUserId);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); 
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        clearStaleUserData(session.user.id);
      }
      setSession(session);
      setUser(session?.user ?? null);
    });

    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      
      if (!nextSession) {
        setSession(null);
        setUser(null);
        return;
      }

      
      const { data: { session: refreshedSession } } = await supabase.auth.getSession();

      // Clear stale data if user changed
      if (refreshedSession?.user?.id) {
        clearStaleUserData(refreshedSession.user.id);
      }

      setSession(refreshedSession);
      setUser(refreshedSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = { user, session, loading: user === undefined };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
