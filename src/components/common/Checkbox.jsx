import { useId } from 'react';

/** Square checkbox - grey box that turns Aionion blue with a tick. */
export default function Checkbox({ checked, onChange, label, className = '', labelClassName = '', disabled, id, ...props }) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <label htmlFor={inputId} className={`group inline-flex cursor-pointer items-start gap-3 ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}>
      <span className="relative mt-0.5 flex-shrink-0">
        <input
          id={inputId}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          {...props}
        />
        <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-slate-300 bg-white transition
          group-hover:border-brand-blue/60 peer-checked:border-brand-blue peer-checked:bg-brand-blue
          peer-focus-visible:ring-4 peer-focus-visible:ring-brand-blue/15">
          <svg className={`h-4 w-4 text-white transition ${checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      {label && <span className={`select-none text-sm text-slate-800 ${labelClassName}`}>{label}</span>}
    </label>
  );
}
