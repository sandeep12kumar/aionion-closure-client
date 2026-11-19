import { useEffect, useState } from 'react';

/** "Resend in 108s..." countdown, then a "Resend OTP" link. Restarts whenever `seconds`/`resetKey` change. */
export default function ResendTimer({ seconds, resetKey, onResend, loading, disabled }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    setLeft(seconds);
    if (!seconds) return undefined;
    const started = Date.now();
    const timer = setInterval(() => {
      const remaining = Math.max(seconds - Math.floor((Date.now() - started) / 1000), 0);
      setLeft(remaining);
      if (!remaining) clearInterval(timer);
    }, 500);
    return () => clearInterval(timer);
  }, [seconds, resetKey]);

  if (left > 0) {
    return <p className="text-sm font-semibold text-gray-800">Resend in {left}s...</p>;
  }
  return (
    <button
      type="button"
      onClick={onResend}
      disabled={loading || disabled}
      className="text-sm font-semibold text-brand-blue underline-offset-2 hover:underline disabled:opacity-50"
    >
      {loading ? 'Sending...' : 'Resend OTP'}
    </button>
  );
}
