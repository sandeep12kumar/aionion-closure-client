import { Spinner } from './Loader.jsx';

const VARIANTS = {
  // Aionion blue gradient - main call to action
  primary: 'bg-brand-gradient text-white shadow-brand hover:brightness-110 active:brightness-95',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:border-brand-blue/40 hover:bg-brand-mist/50 hover:text-brand-blue',
  ghost: 'text-brand-blue hover:bg-brand-mist',
  coral: 'bg-brand-coral text-white shadow-coral hover:bg-brand-coralDark',
  amber: 'bg-amber-400 text-slate-900 ring-1 ring-amber-500/40 hover:bg-amber-300',
  light: 'bg-white text-brand-blue shadow-sm hover:bg-brand-mist',
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children, variant = 'primary', size = 'md', loading = false, disabled = false,
  className = '', type = 'button', uppercase = false, ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-150
        disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none ${VARIANTS[variant]} ${SIZES[size]}
        ${uppercase ? 'uppercase tracking-wider' : ''} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
