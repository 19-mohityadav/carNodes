import { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';

// Role constants
export const ROLES = {
  GUEST:    'guest',
  BUYER:    'buyer',
  SELLER:   'seller',
  AUTHORITY: 'authority',
  PROVIDER: 'provider',
  ADMIN:    'admin',
};

// Demo role assignments for hackathon
// TODO: Replace with on-chain role checks via VehicleRegistry.isAuthorizedVerifier()
// and contract-level AccessControl role queries
const DEMO_ROLES = {
  // Authority wallet — can verify vehicles and approve transfers
  '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b': ROLES.AUTHORITY,
  // Admin wallet
  '0xadmin1234567890abcdef1234567890abcdef1234': ROLES.ADMIN,
};

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const { account, isConnected } = useWallet();
  const [role, setRole] = useState(ROLES.GUEST);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function detectRole() {
      if (!isConnected || !account) {
        setRole(ROLES.GUEST);
        return;
      }

      setLoading(true);
      try {
        const addr = account.toLowerCase();

        // Check demo roles first
        const demoRole = DEMO_ROLES[addr];
        if (demoRole) {
          setRole(demoRole);
          setLoading(false);
          return;
        }

        // TODO: Check on-chain roles:
        // const contracts = getContracts(provider);
        // const isAuthority = await contracts.registry.isAuthorizedVerifier(account);
        // if (isAuthority) { setRole(ROLES.AUTHORITY); return; }

        // Default connected users to buyer
        setRole(ROLES.BUYER);
      } catch (err) {
        console.error('Role detection failed:', err);
        setRole(ROLES.BUYER);
      } finally {
        setLoading(false);
      }
    }

    detectRole();
  }, [account, isConnected]);

  const isAuthority = role === ROLES.AUTHORITY || role === ROLES.ADMIN;
  const isSeller    = role === ROLES.SELLER || role === ROLES.ADMIN;
  const isBuyer     = role === ROLES.BUYER || role === ROLES.ADMIN;
  const isAdmin     = role === ROLES.ADMIN;

  return (
    <RoleContext.Provider value={{
      role,
      setRole,
      loading,
      isAuthority,
      isSeller,
      isBuyer,
      isAdmin,
      ROLES,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within a RoleProvider');
  return ctx;
}
