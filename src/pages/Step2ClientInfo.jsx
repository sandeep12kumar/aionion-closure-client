import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { closureApi, errorMessage } from '../api/closureApi.js';
import { useClosure } from '../context/ClosureContext.jsx';
import Button from '../components/common/Button.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import { FullPageLoader } from '../components/common/Loader.jsx';
import {
  ArrowRightIcon, CheckIcon, EyeIcon, EyeOffIcon, HashIcon, IdCardIcon, UserIcon, WalletIcon,
} from '../components/common/Icons.jsx';
import ClientAvatar from '../components/closure/ClientAvatar.jsx';
import AccountTypeOption from '../components/closure/AccountTypeOption.jsx';
import { ACCOUNT_TYPES, STEP_PATHS } from '../utils/constants.js';
import { maskPan } from '../utils/mask.js';

function DetailTile({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100 sm:p-3.5">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-brand-blue shadow-sm ring-1 ring-brand-blue/10">
        <Icon />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
        <dd className="mt-1 break-words text-[15px] font-bold tracking-wide text-slate-900">{children || '-'}</dd>
      </div>
    </div>
  );
}

/** Step 2 of 4 - Client information (from TechExcel) + which account to close. */
export default function Step2ClientInfo() {
  const navigate = useNavigate();
  const { setSession } = useClosure();
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const [closureType, setClosureType] = useState('');
  const [showPan, setShowPan] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    closureApi.clientInfo()
      .then((res) => {
        setInfo(res.data);
        setClosureType(res.data.closureType || '');
      })
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const proceed = async () => {
    if (!closureType) {
      toast.error('Please select which account to close.');
      return;
    }
    setSaving(true);
    try {
      const res = await closureApi.setAccountType(closureType);
      setSession(res.data);
      navigate(STEP_PATHS[3]);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p className="mx-auto max-w-lg rounded-2xl bg-red-50 p-4 text-center text-sm text-red-700">{error}</p>;
  if (!info) return <FullPageLoader label="Fetching your account details..." />;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader step={2} title="Client information and account closure" subtitle="Your details as per our records. Choose the account you want to close." />

      <div className="card flex animate-fade-up flex-col overflow-hidden md:flex-row">
        {/* Brand panel */}
        <aside className="relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-brand-gradient px-5 py-6 text-white md:w-[32%] md:py-8">
          <div className="bg-dots absolute inset-0" aria-hidden="true" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand-coral/30 blur-3xl" aria-hidden="true" />
          <div className="relative"><ClientAvatar className="h-16 w-16 md:h-20 md:w-20" /></div>
          <div className="relative text-center">
            <p className="text-lg font-bold leading-snug">{info.name}</p>
            <span className="mt-2 inline-block rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold tracking-wider ring-1 ring-white/20">{info.clientCode}</span>
          </div>
          <ul className="relative mt-1 space-y-2 text-xs text-white/85">
            <li className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/90"><CheckIcon className="h-3 w-3" /></span>Mobile &amp; email verified</li>
            <li className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/90"><CheckIcon className="h-3 w-3" /></span>Details from your KYC records</li>
          </ul>
        </aside>

        {/* Details + selection */}
        <section className="min-w-0 flex-1 p-4 sm:p-6">
          <dl className="grid gap-3 sm:grid-cols-2">
            <DetailTile icon={UserIcon} label="Name">{info.name}</DetailTile>
            <DetailTile icon={HashIcon} label="Client Code">{info.clientCode}</DetailTile>
            <DetailTile icon={WalletIcon} label="DP ID">{info.dpId}</DetailTile>
            <DetailTile icon={IdCardIcon} label="Pan Number">
              <span className="inline-flex items-center gap-2">
                {showPan ? info.pan : maskPan(info.pan)}
                <button type="button" onClick={() => setShowPan((v) => !v)} className="rounded-md p-0.5 text-slate-400 hover:text-brand-blue" aria-label={showPan ? 'Hide PAN' : 'Show PAN'}>
                  {showPan ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </span>
            </DetailTile>
          </dl>

          <h2 className="mt-5 text-[15px] font-bold text-slate-900">Please select which account to close :</h2>
          <div className="mt-3 grid gap-2.5 lg:grid-cols-3" role="radiogroup" aria-label="Account to close">
            {ACCOUNT_TYPES.map((option) => (
              <AccountTypeOption key={option.value} option={option} selected={closureType === option.value} onSelect={setClosureType} />
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <Button size="lg" onClick={proceed} loading={saving} disabled={!closureType} className="w-full sm:w-auto">
              Proceed to close Account
              {!saving && <ArrowRightIcon className="h-5 w-5" />}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
