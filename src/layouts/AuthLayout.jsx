import { Outlet } from 'react-router-dom';
import { FileIcon, PenIcon, ShieldIcon, UserIcon } from '../components/common/Icons.jsx';

const JOURNEY = [
  { icon: ShieldIcon, title: 'Verify with OTP', text: 'Secure login with mobile & email OTP' },
  { icon: UserIcon, title: 'Confirm your details', text: 'Choose trading, demat or both' },
  { icon: FileIcon, title: 'Upload documents', text: 'Signature and CMR (for transfers)' },
  { icon: PenIcon, title: 'Aadhaar eSign', text: 'Sign digitally - no paperwork, no courier' },
];

/** Step 1 shell: Aionion brand panel (desktop) + form column. */
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-brand-page lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Brand panel - pinned to the viewport so it never adds page height */}
      <aside className="relative hidden overflow-hidden bg-brand-gradient text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:gap-6 lg:p-10 xl:px-14 xl:py-12">
        <div className="bg-dots absolute inset-0" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-coral/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-blue/50 blur-3xl" aria-hidden="true" />
        <img src="/assets/aionion-icon.png" alt="" className="absolute -right-16 bottom-24 w-80 animate-float opacity-[0.08]" aria-hidden="true" />

        <div className="relative">
          <div className="inline-flex rounded-2xl bg-white px-4 py-2.5 shadow-lg">
            <img src="/assets/aionion-logo.png" alt="Aionion Capital" className="h-11 w-auto" />
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-coral">Online Account Closure</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight">
            Close your account in <span className="text-brand-coral">4 simple steps</span>
          </h2>

          <ol className="mt-6 space-y-3">
            {JOURNEY.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex items-center gap-4 rounded-2xl bg-white/[0.07] p-3.5 ring-1 ring-white/10 backdrop-blur-sm">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20">
                  <Icon />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">
                    <span className="mr-1.5 text-brand-coral">0{i + 1}</span>{title}
                  </span>
                  <span className="block text-xs text-white/65">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Research &nbsp;|&nbsp; Trust &nbsp;|&nbsp; Forever</p>
      </aside>

      {/* Form column */}
      <main className="relative flex min-h-screen flex-col items-center overflow-hidden px-4 py-5 sm:px-6 sm:py-8">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-coral/10 blur-3xl lg:hidden" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-brand-blue/10 blur-3xl" aria-hidden="true" />

        <img src="/assets/aionion-logo.png" alt="Aionion Capital" className="relative mb-4 h-10 w-auto sm:h-11 lg:hidden" />
        <div className="relative my-auto w-full max-w-[520px]">
          <Outlet />
        </div>
        <footer className="relative mt-5 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Aionion Capital Market Services Pvt. Ltd. &middot; All rights reserved
        </footer>
      </main>
    </div>
  );
}
