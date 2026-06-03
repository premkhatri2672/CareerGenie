import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); 
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    
    supabase.auth.getSession().then(({ data: { session } }) => {
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
