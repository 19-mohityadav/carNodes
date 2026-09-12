import { createContext, useContext } from 'react';
import { useAuth, ROLES } from './AuthContext';

export { ROLES };

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const auth = useAuth();

  return (
    <RoleContext.Provider
      value={{
        role: auth.role,
        setRole: auth.setRole,
        loading: auth.loading,
        isAuthority: auth.isAuthority,
        isSeller: auth.isSeller,
        isBuyer: auth.isBuyer,
        isAdmin: auth.isAdmin,
        ROLES,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (ctx) return ctx;

  // Fallback directly to useAuth if RoleProvider isn't wrapped
  try {
    const auth = useAuth();
    return {
      role: auth.role,
      setRole: auth.setRole,
      loading: auth.loading,
      isAuthority: auth.isAuthority,
      isSeller: auth.isSeller,
      isBuyer: auth.isBuyer,
      isAdmin: auth.isAdmin,
      ROLES,
    };
  } catch {
    throw new Error('useRole must be used within an AuthProvider or RoleProvider');
  }
}
