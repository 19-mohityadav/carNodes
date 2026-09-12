import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

export const ROLES = {
  GUEST: 'guest',
  BUYER: 'buyer',
  SELLER: 'seller',
  AUTHORITY: 'authority',
  ADMIN: 'admin',
};

// Seeded demo accounts for instant hackathon testing
export const DEMO_CREDENTIALS = {
  buyer: {
    email: 'buyer@carnodes.com',
    password: 'Buyer123!',
    label: 'Demo Buyer (Arjun Mehta)',
  },
  seller: {
    email: 'seller@carnodes.com',
    password: 'Seller123!',
    label: 'Demo Seller (Apex Dealership)',
  },
  authority: {
    email: 'authority@carnodes.com',
    password: 'Authority123!',
    label: 'Demo Authority (RTO Inspector #409)',
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(ROLES.GUEST);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Normalize role string from database/metadata into standard app role
  const normalizeRole = (rawRole) => {
    if (!rawRole) return ROLES.GUEST;
    const lower = String(rawRole).toLowerCase().trim();
    if (lower === 'authority' || lower === 'rto_admin' || lower === 'inspector') {
      return ROLES.AUTHORITY;
    }
    if (lower === 'seller' || lower === 'dealer') {
      return ROLES.SELLER;
    }
    if (lower === 'buyer' || lower === 'user') {
      return ROLES.BUYER;
    }
    if (lower === 'admin') {
      return ROLES.ADMIN;
    }
    return ROLES.BUYER;
  };

  // Fetch or create user profile from public.user_profiles
  const fetchProfile = useCallback(async (userId, userMetadata = {}) => {
    if (!userId) {
      setProfile(null);
      setRole(ROLES.GUEST);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching user profile:', error.message);
      }

      if (data) {
        setProfile(data);
        const normRole = normalizeRole(data.role);
        setRole(normRole);
        return data;
      }

      // If profile doesn't exist yet, fallback to user_metadata and attempt upsert
      const fallbackRole = normalizeRole(userMetadata.role);
      const fallbackName = userMetadata.name || 'carNodes User';
      const fallbackProfile = {
        id: userId,
        name: fallbackName,
        email: userMetadata.email || '',
        phone: userMetadata.phone || '',
        wallet_address: userMetadata.wallet_address || '',
        role: fallbackRole.toUpperCase(),
        verified: false,
      };

      try {
        const { data: inserted } = await supabase
          .from('user_profiles')
          .insert(fallbackProfile)
          .select()
          .maybeSingle();

        if (inserted) {
          setProfile(inserted);
          setRole(normalizeRole(inserted.role));
          return inserted;
        }
      } catch (insertErr) {
        console.warn('Profile fallback insert warning:', insertErr);
      }

      setProfile(fallbackProfile);
      setRole(fallbackRole);
      return fallbackProfile;
    } catch (err) {
      console.error('fetchProfile unexpected error:', err);
      const fallbackRole = normalizeRole(userMetadata.role);
      setRole(fallbackRole);
      return null;
    }
  }, []);

  // Initialize session and listen for auth state changes
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Get session error:', error.message);
        }

        if (mounted && initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id, initialSession.user.user_metadata);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();

    // Listen for real-time auth changes (Sign In, Sign Out, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);
        const currentUser = currentSession?.user || null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id, currentUser.user_metadata);
        } else {
          setProfile(null);
          setRole(ROLES.GUEST);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign In with Email & Password
  const signIn = async ({ email, password }) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (data?.user) {
        const userProf = await fetchProfile(data.user.id, data.user.user_metadata);
        return { data, profile: userProf };
      }
      return { data };
    } catch (err) {
      const msg = err.message || 'Failed to sign in. Please verify your credentials.';
      setAuthError(msg);
      throw err;
    }
  };

  // Sign Up with Email, Password, Role, and Profile Metadata
  const signUp = async ({ email, password, name, phone, role: selectedRole = 'buyer', roleDetail = '', walletAddress = '' }) => {
    setAuthError(null);
    try {
      const upperRole = selectedRole.toUpperCase();
      const metadata = {
        name: name.trim(),
        phone: phone.trim(),
        role: upperRole,
        role_detail: roleDetail.trim(),
        wallet_address: walletAddress || null,
      };

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      if (data?.user) {
        // If session was established immediately (auto-confirm active)
        if (data.session) {
          setSession(data.session);
          setUser(data.user);
          const userProf = await fetchProfile(data.user.id, metadata);
          return { data, profile: userProf };
        }
      }

      return { data };
    } catch (err) {
      const msg = err.message || 'Failed to sign up. Please try again.';
      setAuthError(msg);
      throw err;
    }
  };

  // 1-Click Demo Login for Hackathon Judges & Testing
  const signInDemo = async (roleName) => {
    const creds = DEMO_CREDENTIALS[roleName];
    if (!creds) throw new Error(`Unknown demo role: ${roleName}`);
    return await signIn({ email: creds.email, password: creds.password });
  };

  // Sign Out
  const signOut = async () => {
    setAuthError(null);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole(ROLES.GUEST);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Link or update Web3 wallet address for current user
  const linkWallet = async (walletAddress) => {
    if (!user || !walletAddress) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ wallet_address: walletAddress, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setProfile(data);
      return data;
    } catch (err) {
      console.error('Error linking wallet address to profile:', err);
      throw err;
    }
  };

  // Update profile fields
  const updateProfile = async (updates) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        if (updates.role) {
          setRole(normalizeRole(data.role));
        }
      }
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  // Role authorization helpers
  const isAuthenticated = Boolean(user && session);
  const isAuthority = role === ROLES.AUTHORITY || role === ROLES.ADMIN;
  const isSeller = role === ROLES.SELLER || role === ROLES.ADMIN;
  const isBuyer = role === ROLES.BUYER || role === ROLES.ADMIN;
  const isAdmin = role === ROLES.ADMIN;

  // Authorization check: does the current user have clearance for the required role?
  const canAccessRole = (requiredRole) => {
    if (!isAuthenticated) return false;
    if (isAdmin) return true;
    const req = String(requiredRole).toLowerCase();
    if (req === 'authority' || req === 'rto_admin') return isAuthority;
    if (req === 'seller') return isSeller;
    if (req === 'buyer') return isBuyer;
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        setRole, // allow demo overriding when needed
        loading,
        authError,
        setAuthError,
        isAuthenticated,
        isBuyer,
        isSeller,
        isAuthority,
        isAdmin,
        canAccessRole,
        signIn,
        signUp,
        signInDemo,
        signOut,
        linkWallet,
        updateProfile,
        refreshProfile: () => user && fetchProfile(user.id, user.user_metadata),
        ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
