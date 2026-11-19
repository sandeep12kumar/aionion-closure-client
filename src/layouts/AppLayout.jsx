import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useClosure } from '../context/ClosureContext.jsx';
import { LockIcon, LogoutIcon } from '../components/common/Icons.jsx';

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'A';

/** Steps 2-4 + success: branded header (logo, client chip, Logout), content, footer. */
export default function AppLayout() {
  const { session, logout } = useClosure();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const onLogout = async () => {
    setBusy(true);
    await logout();
    setBusy(false);
    toast.success('You have been logged out.');
    navigate('/', { replace: true });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-brand-page">
      <header className="sticky top-0 z-30 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.06),0_6px_18px_-12px_rgba(15,26,107,0.25)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <img src="/assets/aionion-logo.png" alt="Aionion Capital" className="h-8 w-auto sm:h-10" />
          <div className="flex items-center gap-3">
            {session && (
              <div className="hidden items-center gap-3 rounded-full bg-brand-mist/70 py-1 pl-1 pr-4 ring-1 ring-brand-blue/10 md:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                  {initials(session.clientName)}
                </span>
                <span className="leading-tight">
                  <span className="block max-w-[200px] truncate text-sm font-bold text-slate-900">{session.clientName}</span>
                  <span className="block text-[11px] text-slate-500">{session.clientCode} &middot; {session.requestNo}</span>
                </span>
              </div>
            )}
            {session && (
              <button
                type="button"
                onClick={onLogout}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-coral/50 hover:text-brand-coral disabled:opacity-60"
              >
                <LogoutIcon className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </div>
        <div className="h-[3px] bg-gradient-to-r from-brand-blue via-brand-navy to-brand-coral" />
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-16 h-72 bg-gradient-to-b from-brand-mist to-transparent" aria-hidden="true" />

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <Outlet />
      </main>

      <footer className="bg-brand-midnight text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1.5 px-4 py-3 text-center text-xs sm:flex-row sm:px-6 sm:text-left">
          <span className="flex items-center gap-2">
            <LockIcon className="h-4 w-4 text-brand-coral" />
            Your data is encrypted and handled securely.
          </span>
          <span>&copy; {new Date().getFullYear()} Aionion Capital Market Services Pvt. Ltd. &middot; Research | Trust | Forever</span>
        </div>
      </footer>
    </div>
  );
}
