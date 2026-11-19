import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { closureApi, errorMessage } from '../api/closureApi.js';
import { useClosure } from '../context/ClosureContext.jsx';
import Button from '../components/common/Button.jsx';
import { AlertIcon, ShieldIcon } from '../components/common/Icons.jsx';
import { STEP_PATHS } from '../utils/constants.js';

const MAX_POLLS = 10;
const POLL_MS = 3000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Setu redirects the client here after the Aadhaar OTP. We confirm the signature with the
 * server (which downloads the signed PDF, submits the request and emails the client).
 */
export default function EsignCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setSession } = useClosure();
  const [error, setError] = useState('');
  const started = useRef(false);

  // Setu adds ?success=false when the client cancels / the OTP fails
  const cancelled = params.get('success') === 'false';

  const confirm = useCallback(async () => {
    setError('');
    for (let i = 0; i < MAX_POLLS; i += 1) {
      try {
        const res = await closureApi.completeSetuEsign();
        if (res.data.state === 'completed') {
          setSession(res.data.session);
          toast.success('Document eSigned and request submitted.');
          navigate(STEP_PATHS[5], { replace: true });
          return;
        }
        if (cancelled && i >= 1) break; // nothing will change - don't keep the client waiting
      } catch (err) {
        setError(errorMessage(err));
        return;
      }
      await sleep(POLL_MS);
    }
    setError(cancelled
      ? 'Aadhaar eSign was cancelled or not completed. Please try again.'
      : 'We are still waiting for confirmation from Aadhaar eSign. Please try again in a moment.');
  }, [cancelled, navigate, setSession]);

  useEffect(() => {
    if (started.current) return; // StrictMode runs effects twice in dev
    started.current = true;
    confirm();
  }, [confirm]);

  return (
    <div className="mx-auto max-w-lg animate-fade-up py-6">
      <div className="card overflow-hidden text-center">
        <div className="h-1.5 bg-gradient-to-r from-brand-blue via-brand-navy to-brand-coral" />
        <div className="px-6 py-10 sm:px-10">
          {!error ? (
            <>
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 animate-ring rounded-full bg-brand-blue/20" />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-white shadow-brand">
                  <ShieldIcon className="h-9 w-9" />
                </span>
              </div>
              <h1 className="mt-6 text-xl font-extrabold text-slate-900">Confirming your Aadhaar eSign...</h1>
              <p className="mt-2 text-sm text-slate-500">Please don&apos;t close this window. We are fetching your signed closure form.</p>
              <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-gradient" />
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-brand-coral ring-8 ring-rose-50/60">
                <AlertIcon className="h-8 w-8" />
              </div>
              <h1 className="mt-5 text-xl font-extrabold text-slate-900">eSign not completed</h1>
              <p className="mt-2 text-sm text-slate-600">{error}</p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="outline" onClick={confirm}>Check again</Button>
                <Button onClick={() => navigate(STEP_PATHS[4], { replace: true })}>Back to eSign</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
