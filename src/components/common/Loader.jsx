export function Spinner({ className = 'h-4 w-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function FullPageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-brand-blue" role="status">
      <img src="/assets/aionion-icon.png" alt="" className="h-12 w-12 animate-pulse" />
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </div>
  );
}
