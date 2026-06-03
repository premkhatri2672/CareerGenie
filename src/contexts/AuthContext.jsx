import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // 1. Get the initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 2. Listen for future auth changes (login, logout, token refresh, SSO callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      // When session becomes null, clear immediately to avoid stale user redirects.
      if (!nextSession) {
        setSession(null);
        setUser(null);
        return;
      }

      // Refresh from Supabase to ensure we use the latest OAuth callback session
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
