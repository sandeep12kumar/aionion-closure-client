import { InfoIcon } from './Icons.jsx';

/** Highlighted note list (Step 1 "Note:" box). */
export default function NoteBox({ title = 'Note', items = [], className = '' }) {
  return (
    <div className={`rounded-2xl bg-brand-mist/70 p-4 ring-1 ring-brand-blue/10 sm:p-5 ${className}`}>
      <p className="flex items-center gap-2 text-sm font-bold text-brand-midnight">
        <InfoIcon className="h-5 w-5 text-brand-blue" />
        {title}
      </p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[13px] font-medium leading-snug text-slate-700">
            <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-coral" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
