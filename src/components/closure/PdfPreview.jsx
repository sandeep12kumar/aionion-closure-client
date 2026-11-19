import { useCallback, useEffect, useState } from 'react';
import { closureApi, errorMessage } from '../../api/closureApi.js';
import { Spinner } from '../common/Loader.jsx';
import Button from '../common/Button.jsx';
import { FileIcon } from '../common/Icons.jsx';

/** Generates the closure form and shows it inline from a short-lived S3 link. */
export default function PdfPreview({ className = '' }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setUrl(await closureApi.formPdfUrl());
    } catch (err) {
      setError(errorMessage(err, 'Could not generate the closure form.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-brand-coral"><FileIcon /></span>
          <span>
            <span className="block text-sm font-bold text-slate-900">Account Closure Form</span>
            <span className="block text-xs text-slate-500">2 pages · filled with your details &amp; signature</span>
          </span>
        </span>
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-blue hover:bg-brand-mist">
            Open in new tab
          </a>
        )}
      </div>
      {/* fills the remaining viewport on desktop (header + stepper + title + footer ≈ 20rem) */}
      <div className="relative h-[60vh] min-h-[360px] bg-slate-100 lg:h-[calc(100vh-20rem)] lg:min-h-[440px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Spinner className="h-8 w-8 text-brand-blue" />
            <span className="text-sm">Preparing your closure form...</span>
          </div>
        )}
        {!loading && error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="outline" size="sm" onClick={load}>Try again</Button>
          </div>
        )}
        {!loading && url && <iframe title="Account closure form" src={`${url}#view=FitH`} className="h-full w-full" />}
      </div>
    </div>
  );
}
