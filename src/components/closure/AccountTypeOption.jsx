import { ChartIcon, CheckIcon, LayersIcon, WalletIcon } from '../common/Icons.jsx';

const ICONS = { TRADING: ChartIcon, DEMAT: WalletIcon, BOTH: LayersIcon };

/** Selectable card for Trading / Demat / Both (behaves as a radio option). */
export default function AccountTypeOption({ option, selected, onSelect }) {
  const Icon = ICONS[option.value];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(option.value)}
      className={`relative flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left sm:p-3.5 transition
        ${selected ? 'border-brand-blue bg-brand-mist/70 shadow-brand' : 'border-slate-200 bg-white hover:border-brand-blue/40 hover:bg-brand-mist/30'}`}
    >
      <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition
        ${selected ? 'bg-brand-gradient text-white' : 'bg-slate-100 text-slate-500'}`}
      >
        <Icon />
      </span>
      <span className="min-w-0 flex-1 pr-6">
        <span className={`block text-sm font-bold ${selected ? 'text-brand-blue' : 'text-slate-900'}`}>{option.label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>
      </span>
      <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition
        ${selected ? 'border-brand-blue bg-brand-blue text-white' : 'border-slate-300 bg-white text-transparent'}`}
      >
        <CheckIcon className="h-3 w-3" />
      </span>
    </button>
  );
}
