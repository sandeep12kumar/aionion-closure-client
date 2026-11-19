import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/common/Icons.jsx';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-brand-page px-4 text-center">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-coral/15 blur-3xl" aria-hidden="true" />
      <img src="/assets/aionion-logo.png" alt="Aionion Capital" className="relative h-12" />
      <h1 className="relative text-7xl font-extrabold text-brand-gradient">404</h1>
      <p className="relative text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="relative inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 font-semibold text-white shadow-brand hover:brightness-110">
        <ArrowLeftIcon className="h-4 w-4" /> Go to Account Closure
      </Link>
    </div>
  );
}
