import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';


export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    toast.error(error.message);
    throw error;
  }
  toast.success('Logged in!');
  return data.session;
};




export const signup = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },                                    
      emailRedirectTo: `${window.location.origin}/login`  
    }
  });
  if (error) {
    toast.error(error.message);
    throw error;
  }

  
  if (data?.user?.identities?.length === 0) {
    toast.error('This email is already registered. Please login instead.');
    throw new Error('Email already registered');
  }

  toast.success('Account created! Check your email to confirm, then log in.');
  return data;
};


export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  if (error) {
    toast.error(error.message);
    throw error;
  }
};


export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error(error.message);
    throw error;
  }
  localStorage.clear();
  toast.success('Logged out');
};


export const getSession = async () => {
  
  try {
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Session fetch timeout')), 1200)
    );
    const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
    if (session) return session;
  } catch (e) {
    console.warn('[auth.js] getSession timed out or failed, returning guest session:', e.message || e);
  }

  return {
    user: {
      id: localStorage.getItem('careergenie_guest_user_id') || 'guest-user-id'
    }
  };
};


export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

export const getUserData = async (userId) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
};
