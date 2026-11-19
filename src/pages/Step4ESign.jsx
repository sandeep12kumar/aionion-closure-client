import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { closureApi, errorMessage } from '../api/closureApi.js';
import Button from '../components/common/Button.jsx';
import Checkbox from '../components/common/Checkbox.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import {
  ArrowLeftIcon, FileIcon, MailIcon, PenIcon, ShieldIcon,
} from '../components/common/Icons.jsx';
import PdfPreview from '../components/closure/PdfPreview.jsx';
import { STEP_PATHS } from '../utils/constants.js';

const HOW_IT_WORKS = [
  { icon: FileIcon, text: 'Review your closure form' },
  { icon: ShieldIcon, text: 'Sign with Aadhaar number & OTP on Setu' },
  { icon: MailIcon, text: 'Signed copy emailed to you' },
];

/** Best-effort browser location for Setu (never blocks: resolves null after 5 s / on denial). */
const getLocation = () => new Promise((resolve) => {
  if (!navigator.geolocation) return resolve(null);
  const timer = setTimeout(() => resolve(null), 5000);
  navigator.geolocation.getCurrentPosition(
    (pos) => { clearTimeout(timer); resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
    () => { clearTimeout(timer); resolve(null); },
    { timeout: 5000, maximumAge: 600_000 },
  );
  return undefined;
});

/** Step 4 of 4 - Review the closure form, consent, Aadhaar eSign via Setu. */
export default function Step4ESign() {
  const navigate = useNavigate();
  const [consent, setConsent] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  /** Upload the form to Setu, then send the client to Setu's Aadhaar OTP page. */
  const startAadhaarEsign = async () => {
    setRedirecting(true);
    try {
      const location = await getLocation();
      const res = await closureApi.startSetuEsign(location);
      toast.loading('Redirecting to Aadhaar eSign...', { id: 'esign-redirect' });
      window.location.assign(res.data.signingUrl);
    } catch (err) {
      toast.error(errorMessage(err));
      setRedirecting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader step={4} title="Review & eSign" subtitle="Check your closure form, then sign it digitally with your Aadhaar." />

      <div className="grid animate-fade-up gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <PdfPreview />

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card overflow-hidden">
            <div className="relative overflow-hidden bg-brand-gradient px-5 py-5 text-white">
              <div className="bg-dots absolute inset-0" aria-hidden="true" />
              <div className="relative flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25"><ShieldIcon /></span>
                <div>
                  <p className="text-base font-bold">Aadhaar eSign</p>
                  <p className="text-xs text-white/75">Legally valid digital signature</p>
                </div>
              </div>
            </div>
            <ol className="space-y-3 p-5">
              {HOW_IT_WORKS.map(({ icon: Icon, text }, i) => (
                <li key={text} className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-mist text-brand-blue"><Icon className="h-4 w-4" /></span>
                  <span><span className="mr-1 font-bold text-brand-coral">{i + 1}.</span>{text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-5">
            <Checkbox
              checked={consent}
              onChange={setConsent}
              label="I confirm that the details in the closure form are correct and I authorise Aionion Capital to close my account. I understand the request is subject to verification."
              labelClassName="!text-[13px] leading-relaxed"
            />
            <Button size="lg" className="mt-5 w-full" disabled={!consent} loading={redirecting} onClick={startAadhaarEsign}>
              {!redirecting && <PenIcon className="h-5 w-5" />}
              {redirecting ? 'Opening Aadhaar eSign...' : 'eSign Document'}
            </Button>
            <Button variant="ghost" className="mt-2 w-full" onClick={() => navigate(STEP_PATHS[3])} disabled={redirecting}>
              <ArrowLeftIcon className="h-4 w-4" /> Back to documents
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
