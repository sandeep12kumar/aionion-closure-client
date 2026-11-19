import { useEffect, useState } from 'react';
import { closureApi } from '../api/closureApi.js';
import { useClosure } from '../context/ClosureContext.jsx';
import { ArrowRightIcon, CheckIcon, ClockIcon, MailIcon, ShieldIcon } from '../components/common/Icons.jsx';
import { ACCOUNT_TYPE_LABEL } from '../utils/constants.js';

const REDIRECT_URL = 'https://www.aionioncapital.com/';
const REDIRECT_SECONDS = 15;

const formatDate = (iso) => (iso
  ? new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
  : '-');

const NEXT = [
  { icon: MailIcon, title: 'Signed form emailed', text: 'A copy of your eSigned closure form has been sent to your registered email ID.', done: true },
  { icon: ShieldIcon, title: 'Verification', text: 'Our team verifies your request and any holdings / balances.' },
  { icon: ClockIcon, title: 'Closure confirmation', text: 'We will notify you once the closure is completed.' },
];

/** Request submitted - shows the request number, then sends the client to aionioncapital.com after 15 s. */
export default function Success() {
  const { session } = useClosure();
  const accountLabel = ACCOUNT_TYPE_LABEL[session?.closureType] || 'Account';
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  // End the session cookie (without clearing React state, which would flash step 1), then leave the app.
  const leave = async () => {
    try { await closureApi.logout(); } catch { /* the redirect must happen regardless */ }
    window.location.replace(REDIRECT_URL);
  };

  useEffect(() => {
    if (secondsLeft <= 0) {
      leave();
      return undefined;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <div className="card overflow-hidden">
        {/* Hero */}
        <div className="relative overflow-hidden bg-brand-gradient px-5 pb-9 pt-6 text-center text-white sm:px-10 sm:pt-7">
          <div className="bg-dots absolute inset-0" aria-hidden="true" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-coral/30 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto flex h-14 w-14 animate-pop items-center justify-center rounded-full bg-white text-emerald-500 shadow-xl ring-8 ring-white/15 sm:h-16 sm:w-16">
            <CheckIcon className="h-8 w-8" />
          </div>
          <h1 className="relative mt-4 text-xl font-extrabold leading-snug sm:text-2xl">Your account closure request has been submitted</h1>
          <p className="relative mt-1.5 text-sm text-white/80">{accountLabel} &middot; signed on {formatDate(session?.esignedAt)}</p>
        </div>

        {/* Request number */}
        <div className="relative -mt-5 px-5 sm:px-10">
          <div className="mx-auto max-w-sm rounded-2xl bg-white px-5 py-3 text-center shadow-card ring-1 ring-slate-900/5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Request Number</p>
            <p className="mt-0.5 break-all text-xl font-extrabold tracking-wide text-brand-gradient sm:text-2xl">{session?.requestNo}</p>
          </div>
        </div>

        {/* What happens next */}
        <div className="px-5 pb-5 pt-5 sm:px-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">What happens next</h2>
          <ol className="mt-3">
            {NEXT.map(({ icon: Icon, title, text, done }, i) => (
              <li key={title} className="relative flex gap-3.5 pb-4 last:pb-0">
                {i < NEXT.length - 1 && <span className="absolute left-[18px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-slate-200" aria-hidden="true" />}
                <span className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl
                  ${done ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-brand-mist text-brand-blue ring-1 ring-brand-blue/10'}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900">
                    {title}
                    {done && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">Done</span>}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-slate-500">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Auto redirect */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-center sm:flex-row sm:px-10 sm:text-left">
          <p className="text-[13px] text-slate-600" aria-live="polite">
            Redirecting to <span className="font-semibold text-slate-800">aionioncapital.com</span> in{' '}
            <span className="tabular-nums font-bold text-brand-blue">{secondsLeft}s</span>
          </p>
          <button type="button" onClick={leave} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline">
            Go now <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
