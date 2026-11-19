import { STEPS, TOTAL_STEPS } from '../../utils/constants.js';
import { CheckIcon } from './Icons.jsx';

/** "Step X of 4" + numbered progress (Request, Client Info, Documents, eSign). */
export default function Stepper({ step, className = '' }) {
  return (
    <div className={className}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-coral">Step {step} of {TOTAL_STEPS}</p>
      <ol className="mt-3 flex items-start" aria-label="Progress">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li key={label} className={`flex items-start ${i < STEPS.length - 1 ? 'flex-1' : ''}`} aria-current={current ? 'step' : undefined}>
              <div className="flex flex-col items-center">
                <span className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition
                  ${done ? 'bg-brand-gradient text-white shadow-brand' : ''}
                  ${current ? 'bg-white text-brand-blue ring-2 ring-brand-blue shadow-brand' : ''}
                  ${!done && !current ? 'bg-slate-100 text-slate-400' : ''}`}
                >
                  {current && <span className="absolute inset-0 animate-ring rounded-full ring-2 ring-brand-blue/40" />}
                  {done ? <CheckIcon className="h-4 w-4" /> : n}
                </span>
                <span className={`mt-1.5 hidden whitespace-nowrap text-[11px] font-semibold sm:block
                  ${current ? 'text-brand-blue' : done ? 'text-slate-700' : 'text-slate-400'}`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 mt-[17px] h-[3px] flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div className={`h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-coral transition-all duration-500 ${done ? 'w-full' : 'w-0'}`} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
