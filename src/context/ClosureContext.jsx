import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { closureApi, SESSION_EXPIRED_EVENT } from '../api/closureApi.js';

const ClosureContext = createContext(null);

/**
 * Holds the logged-in closure request (server is the source of truth -
 * the session lives in an httpOnly cookie, we only cache the public view).
 */
export function ClosureProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await closureApi.session();
      setSession(res.data);
      return res.data;
    } catch {
      setSession(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await closureApi.logout();
    } catch {
      /* cookie is cleared server side anyway */
    }
    setSession(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onExpired = () => {
      setSession((current) => {
        if (current) toast.error('Your session has expired. Please start again.', { id: 'session-expired' });
        return null;
      });
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const value = useMemo(() => ({ session, setSession, loading, refresh, logout }), [session, loading, refresh, logout]);
  return <ClosureContext.Provider value={value}>{children}</ClosureContext.Provider>;
}

export const useClosure = () => {
  const ctx = useContext(ClosureContext);
  if (!ctx) throw new Error('useClosure must be used inside <ClosureProvider>');
  return ctx;
};
